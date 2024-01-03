/**
 * @copyright Copyright (c) 2023 Dorra Jaouad <dorra.jaoued7@gmail.com>
 *
 * @author Marco Ambrosini <marcoambrosini@icloud.com>
 * @author Dorra Jaouad <dorra.jaoued7@gmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { defineStore } from 'pinia'
import Vue from 'vue'

import { getReactionsDetails } from '../services/messagesService.js'
import store from '../store/index.js'

/**
 * @typedef {string} Token
 */

/**
 * @typedef {number} MessageId
 */

/**
 * @typedef {object} Reactions
 * @property {string} emoji - reaction emoji
 * @property {object} participant - reacting participant
 */

/**
 * @typedef {object} State
 * @property {{[key: Token]: {[key: MessageId]: Reactions}}} reactions - The reactions per message.
 */

/**
 * Store for conversation extra chat features apart from messages
 *
 * @param {string} id store name
 * @param {State} options.state store state structure
 */
export const useReactionsStore = defineStore('reactions', {
	state: () => ({
		reactions: {},
	}),

	getters: {
		getReactions: (state) => (token, messageId) => {
			if (state.reactions?.[token]?.[messageId]) {
				return state.reactions[token][messageId]
			} else {
				return undefined
			}
		},
	},

	actions: {
		/**
		 * Add a reaction for a given message.
		 *
		 * @param {object} payload action payload
		 * @param {string} payload.token The conversation token
		 * @param {number} payload.messageId The id of message
		 * @param {string} payload.reaction The reaction to add
		 * @param {object} payload.actors The users who reacted
		 *
		 */
		addReaction({ token, messageId, reaction, actors }) {
			if (!this.reactions[token]) {
				Vue.set(this.reactions, token, {})

			}
			if (!this.reactions[token][messageId]) {
				Vue.set(this.reactions[token], messageId, {})

			}
			if (!this.reactions[token][messageId][reaction]) {
				Vue.set(this.reactions[token][messageId], reaction, actors)
				return
			}

			Vue.set(this.reactions[token][messageId], reaction, actors)
		},

		/**
		 * Remove a reaction for a given message.
		 *
		 * @param {object} payload action payload
		 * @param {string} payload.token The conversation token
		 * @param {number} payload.messageId The id of message
		 * @param {string} payload.reaction The reaction to remove
		 *
		 */
		removeReaction({ token, messageId, reaction }) {
			Vue.delete(this.reactions[token][messageId], reaction)
		},

		/**
		 * Add an actor for a given reaction emoji.
		 *
		 * @param {object} payload action payload
		 * @param {string} payload.token The conversation token
		 * @param {number} payload.messageId The id of message
		 * @param {string} payload.emoji The reaction emoji
		 * @param {object} payload.actor The user who reacted
		 *
		 */
		addActorToReaction({ token, messageId, emoji, actor }) {
			if (!this.reactions[token]) {
				Vue.set(this.reactions, token, {})

			}
			if (!this.reactions[token][messageId]) {
				Vue.set(this.reactions[token], messageId, {})

			}
			if (!this.reactions[token][messageId][emoji]) {
				Vue.set(this.reactions[token][messageId], emoji, [])
			}
			const actors = this.reactions[token][messageId][emoji]
			// Find if actor is already in the list
			// This is needed when loading as revoking messages fully updates the list
			const actorExists = actors.find(a => a.actorId === actor.actorId)
			if (actorExists) {
				return
			}
			actors.push(actor)
			Vue.set(this.reactions[token][messageId], emoji, actors)
		},

		/**
		 * Adds reactions for a given message.
		 *
		 * @param {object} payload action payload
		 * @param {string} payload.token The conversation token
		 * @param {number} payload.messageId The id of message
		 * @param {object} payload.reactions The list of reactions with details for a given message
		 *
		 */
		addReactions({ token, messageId, reactions }) {
			if (!this.reactions[token]) {
				Vue.set(this.reactions, token, {})

			}
			Vue.set(this.reactions[token], messageId, reactions)
		},

		/**
		 * Delete all reactions for a given message.
		 *
		 * @param {string} token The conversation token
		 * @param {number} messageId The id of message
		 *
		 */
		resetReactions(token, messageId) {
			if (!this.reactions[token]) {
				Vue.set(this.reactions, token, {})
			}
			Vue.delete(this.reactions[token], messageId)
		},

		/**
		 * Updates reactions for a given message.
		 *
		 * @param {object} payload action payload
		 * @param {string} payload.token The conversation token
		 * @param {number} payload.messageId The id of message
		 * @param {object} payload.reactionsDetails The list of reactions with details for a given message
		 *
		 */
		updateReactions({ token, messageId, reactionsDetails }) {
			if (!this.reactions[token]) {
				Vue.set(this.reactions, token, {})
			}

			if (!this.reactions[token][messageId]) {
				Vue.set(this.reactions[token], messageId, {})
			}

			const storedReactions = this.reactions[token][messageId]

			if (Object.keys(reactionsDetails).length === 0) {
				this.resetReactions(token, messageId)
				return
			}

			if (Object.keys(storedReactions).length === 0) {
				Vue.set(this.reactions[token], messageId, reactionsDetails)
				return
			}

			// Handle removed reactions
			const removedReactions = Object.keys(storedReactions).filter(reaction => {
				return !reactionsDetails[reaction]
			})
			if (Object.keys(removedReactions).length > 0) {
				removedReactions.forEach(reaction => {
					this.removeReaction({ token, messageId, reaction })
				})
			}

			// Add new reactions and/or update existing ones
			Object.entries(reactionsDetails).forEach(([reaction, actors]) => {
				if (!storedReactions[reaction] || JSON.stringify(actors) !== JSON.stringify(storedReactions[reaction])) {
					this.addReaction({ token, messageId, reaction, actors })
				}
			})
		},

		/**
		 * Process a reaction system message.
		 *
		 * @param {object} message the system message
		 *
		 */
		processReaction(message) {
			// Ignore reactions from self because it is processed locally
			if (message.actorId === store.getters.getActorId()) {
				return
			}

			// 'reaction_deleted' is not handled because it is a message replacement
			// for 'reaction' when the reaction is revoked, thus it doesn't exist anymore
			if (message.systemMessage === 'reaction') {
				const actorObject = {
					actorDisplayName: message.actorDisplayName,
					actorId: message.actorId,
					actorType: message.actorType,
					timestamp: message.timestamp,
				}
				this.addActorToReaction({
					token: message.token,
					messageId: message.parent.id,
					emoji: message.message,
					actor: actorObject,
				})
			} else if (message.systemMessage === 'reaction_revoked') {
				this.fetchReactions(message.token, message.parent.id)
			}
		},

		/**
		 * Gets the full reactions list for a given message.
		 *
		 * @param {string} token The conversation token
		 * @param {number} messageId The id of message
		 *
		 */
		async fetchReactions(token, messageId) {
			console.debug('getting reactions details')
			try {
				const response = await getReactionsDetails(token, messageId)
				this.updateReactions({
					token,
					messageId,
					reactionsDetails: response.data.ocs.data,
				})
				return response
			} catch (error) {
				console.debug(error)
			}
		},

	},
})
