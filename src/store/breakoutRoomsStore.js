/**
 * @copyright Copyright (c) 2022 Marco Ambrosini <marcoambrosini@icloud.com>
 *
 * @author Marco Ambrosini <marcoambrosini@icloud.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import {
	configureBreakoutRooms,
	deleteBreakoutRooms,
	getBreakoutRooms,
	startBreakoutRooms,
	stopBreakoutRooms,
	broadcastMessageToBreakoutRooms,
	getBreakoutRoomsParticipants,
	requestAssistance,
	resetRequestAssistance,
	reorganizeAttendees,
	switchToBreakoutRoom,
} from '../services/breakoutRoomsService.js'
import { showError } from '@nextcloud/dialogs'
import Vue from 'vue'
import { emit } from '@nextcloud/event-bus'

const state = {
	breakoutRooms: {},
}

const getters = {
	breakoutRooms: (state) => (token) => {
		if (!state.breakoutRooms[token]) {
			return []
		}
		return state.breakoutRooms?.[token]
	},

	// Get the parent room token provided a breakoutroom token
	parentRoomToken: (state) => (token) => {
		for (const parentRoomToken in state.breakoutRooms) {
			if (state.breakoutRooms[parentRoomToken].find(breakoutRoom => breakoutRoom.token === token)) {
				return parentRoomToken
			}
		}
	},
}

const mutations = {
	/**
	 * Adds a breakout room to the store.
	 *
	 * @param {object} state current store state;
	 * @param {object} conversation the conversation;
	 * @param conversation.parentRoomToken
	 * @param parentRoomToken the parent room token;
	 * @param breakoutRoom
	 * @param conversation.breakoutRoom
	 */
	addBreakoutRoom(state, { parentRoomToken, breakoutRoom }) {
		if (!state.breakoutRooms[parentRoomToken]) {
			Vue.set(state.breakoutRooms, parentRoomToken, [])
		}
		// The breakout room to be added is first removed if it exists already.
		state.breakoutRooms[parentRoomToken] = state.breakoutRooms[parentRoomToken].filter(current => current.token !== breakoutRoom.token)
		Vue.set(state.breakoutRooms, parentRoomToken, [...state.breakoutRooms[parentRoomToken], breakoutRoom])
	},

	// Deletes all breakout rooms for a given parent room token
	deleteBreakoutRooms(state, parentRoomToken) {
		Vue.delete(state.breakoutRooms, parentRoomToken)
	},
}

/**
 * The breakout rooms api return an array with mixed breakout rooms and "parent" conversations, we want to add the
 * breakout rooms to this store and update the parent conversations in the conversations store.
 *
 * @param conversationsList the array of mixed breakout rooms and "parent" conversation
 * @param parentRoomToken
 * @param context the context object
 */
const processConversations = (conversationsList, parentRoomToken, context) => {

	conversationsList.forEach(conversation => {
		if (conversation.token === parentRoomToken) {
			context.commit('addConversation', conversation)
		} else {
			context.commit('addBreakoutRoom', {
				parentRoomToken,
				breakoutRoom: conversation,
			})
		}
	})
}

const actions = {
	async configureBreakoutRoomsAction(context, { token, mode, amount, attendeeMap }) {
		try {
			const response = await configureBreakoutRooms(token, mode, amount, attendeeMap)
			// Get the participants of the breakout rooms
			context.dispatch('getBreakoutRoomsParticipantsAction', { token })

			processConversations(response.data.ocs.data, token, context)

			// Open the sidebar and switch to the breakout rooms tab
			emit('spreed:select-active-sidebar-tab', 'breakout-rooms')
			context.dispatch('showSidebar')

		} catch (error) {
			console.error(error)
			showError(t('spreed', 'An error occurred while creating breakout rooms'))
		}
	},

	async reorganizeAttendeesAction(context, { token, attendeeMap }) {
		try {
			const response = await reorganizeAttendees(token, attendeeMap)
			// Get the participants of the breakout rooms
			context.dispatch('getBreakoutRoomsParticipantsAction', { token })

			processConversations(response.data.ocs.data, token, context)

		} catch (error) {
			console.error(error)
			showError(t('spreed', 'An error occurred while re-ordering the attendees'))
		}
	},

	async deleteBreakoutRoomsAction(context, { token }) {
		try {
			const response = await deleteBreakoutRooms(token)
			const conversation = response.data.ocs.data

			// Add the updated parent conversation to the conversations store
			context.commit('addConversation', conversation)

			// Remove breakout rooms from this store
			context.commit('deleteBreakoutRooms', token)
		} catch (error) {
			console.error(error)
			showError(t('spreed', 'An error occurred while deleting breakout rooms'))
		}
	},

	async getBreakoutRoomsAction(context, { token }) {
		try {
			const response = await getBreakoutRooms(token)

			processConversations(response.data.ocs.data, token, context)

		} catch (error) {
			console.error(error)
		}
	},

	async startBreakoutRoomsAction(context, token) {
		try {
			const response = await startBreakoutRooms(token)

			processConversations(response.data.ocs.data, token, context)
		} catch (error) {
			console.error(error)
			showError(t('spreed', 'An error occurred while starting breakout rooms'))
		}
	},

	async stopBreakoutRoomsAction(context, token) {
		try {
			const response = await stopBreakoutRooms(token)

			processConversations(response.data.ocs.data, token, context)
		} catch (error) {
			console.error(error)
			showError(t('spreed', 'An error occurred while stopping breakout rooms'))
		}
	},

	async broadcastMessageToBreakoutRoomsAction(context, { temporaryMessage }) {
		try {
			await broadcastMessageToBreakoutRooms(temporaryMessage.message, temporaryMessage.token)
		} catch (error) {
			console.error(error)
			showError(t('spreed', 'An error occurred while sending a message to the breakout rooms'))
		}
	},

	async getBreakoutRoomsParticipantsAction(context, { token }) {
		try {
			const response = await getBreakoutRoomsParticipants(token)

			// Purge the participants of the breakout rooms before adding the updated ones
			context.state.breakoutRooms[token].forEach(breakoutRoom => {
				context.commit('purgeParticipantsStore', breakoutRoom.token)
			})

			// Purge the participants of the main room
			context.commit('purgeParticipantsStore', token)

			// Add the participants of the breakout rooms to the participants store
			response.data.ocs.data.forEach(participant => {
				context.dispatch('addParticipant', {
					token: participant.roomToken,
					participant,
				})
			})

		} catch (error) {
			console.error(error)
		}
	},

	async requestAssistanceAction(context, { token }) {
		try {
			const response = await requestAssistance(token)
			// Add the updated parent conversation to the conversations store
			context.commit('addConversation', response.data.ocs.data)
		} catch (error) {
			console.error(error)
			showError(t('spreed', 'An error occurred while requesting assistance'))
		}
	},

	async resetRequestAssistanceAction(context, { token }) {
		try {
			const response = await resetRequestAssistance(token)
			// Add the updated parent conversation to the conversations store
			context.commit('addConversation', response.data.ocs.data)
		} catch (error) {
			console.error(error)
			showError(t('spreed', 'An error occurred while resetting the request for assistance'))
		}
	},

	async switchToBreakoutRoomAction(context, { token, target }) {
		try {
			const response = await switchToBreakoutRoom(token, target)

			// A single breakout room (the target one) is returned, so it needs
			// to be wrapper in an array.
			processConversations([response.data.ocs.data], token, context)
		} catch (error) {
			console.error(error)
			showError(t('spreed', 'An error occurred while joining breakout room'))
		}
	},
}

export default { state, getters, mutations, actions }
