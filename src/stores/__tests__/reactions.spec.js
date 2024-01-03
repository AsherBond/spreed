import { createLocalVue } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Vuex from 'vuex'

import { showError } from '@nextcloud/dialogs'

import { getReactionsDetails, addReactionToMessage, removeReactionFromMessage } from '../../services/messagesService.js'
import vuexStore from '../../store/index.js'
import { useReactionsStore } from '../reactions.js'

jest.mock('../../services/messagesService', () => ({
	getReactionsDetails: jest.fn(),
	addReactionToMessage: jest.fn(),
	removeReactionFromMessage: jest.fn(),
}))

jest.mock('@nextcloud/dialogs', () => ({
	showSuccess: jest.fn(),
	showError: jest.fn(),
}))

describe('reactionsStore', () => {
	let reactionsStore
	let token
	let messageId
	let reactions
	let localVue

	beforeEach(() => {
		setActivePinia(createPinia())
		reactionsStore = useReactionsStore()

		localVue = createLocalVue()
		localVue.use(Vuex)

		token = 'token1'
		messageId = 'parent-id'
		reactions = {
			'🎄': [
				{ displayName: 'user1', actorId: 'actorId1' },
				{ displayName: 'user2', actorId: 'actorId2' }
			],
			'🔥': [
				{ displayName: 'user3', actorId: 'actorId3' },
				{ displayName: 'user4', actorId: 'actorId4' }
			],
			'🔒': [
				{ displayName: 'user3', actorId: 'actorId3' },
				{ displayName: 'user4', actorId: 'actorId4' }
			],
		}

		reactionsStore.updateReactions({
			token,
			messageId,
			reactionsDetails: reactions
		})
	})

	afterEach(() => {
		jest.clearAllMocks()
		reactionsStore.resetReactions(token, messageId)
	})

	it('fetches reactions from the store', () => {
		// Arrange
		getReactionsDetails.mockResolvedValue({
			data: {
				ocs: {
					data: reactions
				}
			}
		})

		// Act
		reactionsStore.fetchReactions()

		// Assert
		expect(reactionsStore.getReactions(token, messageId)).toEqual(reactions)
	})
	it('updates reactions from the store', () => {
		// Arrange
		const newReactions = {
			'🎄': [
				{ actorDisplayName: 'user1', actorId: 'actorId1' },
			],
			'😅': [
				{ actorDisplayName: 'user1', actorId: 'actorId1' },
				{ actorDisplayName: 'user2', actorId: 'actorId2' }
			],
			'💜': [
				{ actorDisplayName: 'user3', actorId: 'actorId3' },
				{ actorDisplayName: 'user4', actorId: 'actorId4' }
			]
		}
		// Act
		reactionsStore.updateReactions({
			token,
			messageId,
			reactionsDetails: newReactions
		})

		// Assert
		expect(reactionsStore.getReactions(token, messageId)).toEqual(newReactions)
	})
	it('resets the store when there is no reaction', () => {
		// Arrange
		const emptyReactions = {}
		jest.spyOn(reactionsStore, 'resetReactions')
		// Act
		reactionsStore.updateReactions({
			token,
			messageId,
			reactionsDetails: emptyReactions
		})
		// Assert
		expect(reactionsStore.getReactions(token, messageId)).toEqual(undefined)
	})
	it('adds reaction from system messages', () => {
		// Arrange
		const message = {
			systemMessage: 'reaction',
			actorDisplayName: 'Test Actor',
			actorId: '123',
			actorType: 'user',
			timestamp: Date.now(),
			token,
			parent: {
				id: messageId
			},
			message: '😅'
		}
		expect(Object.keys(reactionsStore.getReactions(token, messageId))).toEqual(['🎄', '🔥', '🔒'])
		// Act
		reactionsStore.processReaction(message)

		// Assert
		expect(Object.keys(reactionsStore.getReactions(token, messageId))).toContain('😅')
	})
	it('does not add a reaction actor when it already exists', () => {
		// Arrange
		const message = {
			systemMessage: 'reaction',
			actorDisplayName: 'Test Actor',
			actorId: 'actorId1',
			actorType: 'user1',
			timestamp: Date.now(),
			token,
			parent: {
				id: messageId
			},
			message: '🎄'
		}
		expect(Object.keys(reactionsStore.getReactions(token, messageId))).toEqual(['🎄', '🔥', '🔒'])
		// Act
		reactionsStore.processReaction(message)

		// Assert
		const actors = reactionsStore.getReactions(token, messageId)['🎄']
		expect(actors.length).toEqual(2) // should not add a new actor
	})
	it('removes a reaction from the store', async () => {
		// Arrange
		const message = {
			systemMessage: 'reaction_revoked',
			actorDisplayName: 'Test Actor',
			actorId: '123',
			actorType: 'user',
			timestamp: Date.now(),
			token,
			parent: {
				id: messageId
			},
			message: 'reaction removed'
		}

		getReactionsDetails.mockResolvedValue({
			data: {
				ocs: {
					data: {
						'🎄': [
							{ displayName: 'user1', actorId: 'actorId1' },
							{ displayName: 'user2', actorId: 'actorId2' }
						],
						'🔥': [
							{ displayName: 'user3', actorId: 'actorId3' },
							{ displayName: 'user4', actorId: 'actorId4' }
						]
					}
				}
			}
		})
		jest.spyOn(reactionsStore, 'removeReaction')
		jest.spyOn(reactionsStore, 'fetchReactions')

		// Act
		await reactionsStore.processReaction(message)

		// Assert
		expect(getReactionsDetails).toHaveBeenCalled()
		expect(Object.keys(reactionsStore.reactions[token][messageId])).toEqual(['🎄', '🔥'])
	})
	it('does not fetch reactions when receiving a reaction_deleted system message', async () => {
		// Arrange
		const message = {
			systemMessage: 'reaction_deleted',
			actorDisplayName: 'Test Actor',
			actorId: '123',
			actorType: 'user',
			timestamp: Date.now(),
			token,
			parent: {
				id: messageId
			},
			message: 'reaction removed'
		}

		// Act
		await reactionsStore.processReaction(message)

		// Assert
		expect(getReactionsDetails).not.toHaveBeenCalled()
	})

	describe('error handling', () => {
		it('does not add a reaction when the API call fails', async () => {
			// Arrange
			addReactionToMessage.mockRejectedValue(new Error('API call failed'))
			jest.spyOn(vuexStore, 'commit')

			const message = {
				actorId: 'admin',
				actorType: 'users',
				id: messageId,
				markdown: true,
				message: 'This is a message to have reactions on',
				reactions: { '🎄': 2, '🔥': 2, '🔒': 2 },
				reactionsSelf: ['🔥'],
				timestamp: 1703668230,
				token
			}
			vuexStore.commit('addMessage', message) // add a message to the store

			// Act
			await reactionsStore.addReactionToMessage({ token, messageId, selectedEmoji: '😅' })

			// Assert
			expect(vuexStore.commit).toHaveBeenCalledWith('addReactionToMessage', {
				token,
				messageId,
				reaction: '😅'
			})
			expect(showError).toHaveBeenCalled()
			expect(Object.keys(reactionsStore.getReactions(token, messageId))).toEqual(['🎄', '🔥', '🔒']) // no reaction added
		})
		it('does not remove a reaction when the API call fails', async () => {
			// Arrange
			removeReactionFromMessage.mockRejectedValue(new Error('API call failed'))
			jest.spyOn(vuexStore, 'commit')

			const message = {
				actorId: 'admin',
				actorType: 'users',
				id: messageId,
				markdown: true,
				message: 'This is a message to have reactions on',
				reactions: { '🎄': 2, '🔥': 2, '🔒': 2 },
				reactionsSelf: ['🔥'],
				timestamp: 1703668230,
				token
			}

			vuexStore.commit('addMessage', message) // add a message to the store

			// Act
			await reactionsStore.removeReactionFromMessage({ token, messageId, selectedEmoji: '🎄' })

			// Assert
			expect(vuexStore.commit).toHaveBeenCalledWith('removeReactionFromMessage', {
				token,
				messageId,
				reaction: '🎄'
			})
			expect(showError).toHaveBeenCalled()
			expect(reactionsStore.getReactions(token, messageId)['🎄'].length).toEqual(2) // no reaction removed
		})
		it('shows an error when the API call of fetching reactions fails', async () => {
			// Arrange
			getReactionsDetails.mockRejectedValue(new Error('API call failed'))
			console.debug = jest.fn()

			// Act
			await reactionsStore.fetchReactions({ token, messageId })

			// Assert
			expect(console.debug).toHaveBeenCalled()
		})
	})
})
