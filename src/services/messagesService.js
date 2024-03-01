/**
 * @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@icloud.com>
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

import Hex from 'crypto-js/enc-hex.js'
import SHA256 from 'crypto-js/sha256.js'

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'

/**
 * Fetches messages that belong to a particular conversation
 * specified with its token.
 *
 * @param {object} data the wrapping object;
 * @param {string} data.token the conversation token;
 * @param {string} data.lastKnownMessageId last known message id;
 * @param {boolean} data.includeLastKnown whether to include the last known message in the response;
 * @param {number} [data.lookIntoFuture=0] direction of message fetch
 * @param {number} [data.limit=100] Number of messages to load
 * @param {object} options options;
 */
const fetchMessages = async function({ token, lastKnownMessageId, includeLastKnown, lookIntoFuture = 0, limit = 100 }, options) {
	return axios.get(generateOcsUrl('apps/spreed/api/v1/chat/{token}', { token }, options), {
		...options,
		params: {
			setReadMarker: 0,
			lookIntoFuture,
			lastKnownMessageId,
			limit,
			includeLastKnown: includeLastKnown ? 1 : 0,
		},
	})
}

/**
 * Fetches newly created messages that belong to a particular conversation
 * specified with its token.
 *
 * @param {object} data the wrapping object;
 * @param {number} data.lastKnownMessageId The id of the last message in the store.
 * @param {string} data.token The conversation token;
 * @param {number} [data.limit=100] Number of messages to load
 * @param {object} options options
 */
const lookForNewMessages = async ({ token, lastKnownMessageId, limit = 100 }, options) => {
	return axios.get(generateOcsUrl('apps/spreed/api/v1/chat/{token}', { token }, options), {
		...options,
		params: {
			setReadMarker: 0,
			lookIntoFuture: 1,
			lastKnownMessageId,
			limit,
			includeLastKnown: 0,
			markNotificationsAsRead: 0,
		},
	})
}

/**
 * Get the context of a message
 *
 * Loads some messages from before and after the given one.
 *
 * @param {object} data the wrapping object;
 * @param {string} data.token the conversation token;
 * @param {number} data.messageId last known message id;
 * @param {number} [data.limit=50] Number of messages to load
 * @param {object} options options;
 */
const getMessageContext = async function({ token, messageId, limit = 50 }, options) {
	return axios.get(generateOcsUrl('apps/spreed/api/v1/chat/{token}/{messageId}/context', { token, messageId }, options), {
		...options,
		params: {
			limit,
		},
	})
}

/**
 * Posts a new message to the server.
 *
 * @param {object} param0 The message object that is destructured
 * @param {string} param0.token The conversation token
 * @param {string} param0.message The message text
 * @param {string} param0.actorDisplayName The display name of the actor
 * @param {string} param0.referenceId A reference id to identify the message later again
 * @param {object|undefined} param0.parent The message to be replied to
 * @param {object} param1 options object destructured
 * @param {boolean} param1.silent whether the message should trigger a notifications
 */
const postNewMessage = async function({ token, message, actorDisplayName, referenceId, parent }, { silent, ...options }) {
	return axios.post(generateOcsUrl('apps/spreed/api/v1/chat/{token}', { token }, options), {
		message,
		actorDisplayName,
		referenceId,
		replyTo: parent?.id,
		silent,
	}, options)
}

/**
 * Deletes a message from the server.
 *
 * @param {object} param0 The message object that is destructured
 * @param {string} param0.token The conversation token
 * @param {string} param0.id The id of the message to be deleted
 * @param {object} options request options
 */
const deleteMessage = async function({ token, id }, options) {
	return axios.delete(generateOcsUrl('apps/spreed/api/v1/chat/{token}/{id}', { token, id }, options), options)
}

/**
 * Edit a message text / file share caption.
 *
 * @param {object} param0 The destructured payload
 * @param {string} param0.token The conversation token
 * @param {string} param0.messageId The message id
 * @param {string} param0.updatedMessage The modified text of the message / file share caption
 * @param {object} options request options
 */
const editMessage = async function({ token, messageId, updatedMessage }, options) {
	return axios.put(generateOcsUrl('apps/spreed/api/v1/chat/{token}/{messageId}', { token, messageId }, options), {
		message: updatedMessage,
	}, options)
}

/**
 * Post a rich object to a conversation
 *
 * @param {string} token conversation token
 * @param {object} data the wrapping object;
 * @param {string} data.objectType object type
 * @param {string} data.objectId object id
 * @param {string} data.metaData JSON metadata of the rich object encoded as string
 * @param {string} data.referenceId generated reference id, leave empty to generate it based on the other args
 * @param {object} options request options
 */
const postRichObjectToConversation = async function(token, { objectType, objectId, metaData, referenceId }, options) {
	if (!referenceId) {
		const tempId = 'richobject-' + objectType + '-' + objectId + '-' + token + '-' + (new Date().getTime())
		referenceId = Hex.stringify(SHA256(tempId))
	}
	return axios.post(generateOcsUrl('apps/spreed/api/v1/chat/{token}/share', { token }, options), {
		objectType,
		objectId,
		metaData,
		referenceId,
	}, options)
}

/**
 * Updates the last read message id
 *
 * @param {string} token The token of the conversation to be removed from favorites
 * @param {number} lastReadMessage id of the last read message to set
 * @param {object} options request options
 */
const updateLastReadMessage = async function(token, lastReadMessage, options) {
	return axios.post(generateOcsUrl('apps/spreed/api/v1/chat/{token}/read', { token }, options), {
		lastReadMessage,
	}, options)
}

const addReactionToMessage = async function(token, messageId, selectedEmoji, options) {
	return axios.post(generateOcsUrl('apps/spreed/api/v1/reaction/{token}/{messageId}', { token, messageId }, options), {
		reaction: selectedEmoji,
	}, options)
}

const removeReactionFromMessage = async function(token, messageId, selectedEmoji, options) {
	return axios.delete(generateOcsUrl('apps/spreed/api/v1/reaction/{token}/{messageId}', { token, messageId }, options), {
		...options,
		params: {
			reaction: selectedEmoji,
		},
	})
}

const getReactionsDetails = async function(token, messageId, options) {
	return axios.get(generateOcsUrl('apps/spreed/api/v1/reaction/{token}/{messageId}', { token, messageId }, options), options)
}

const getTranslationLanguages = async function(options) {
	return axios.get(generateOcsUrl('/translation/languages', undefined, options), options)
}

const translateText = async function(text, fromLanguage, toLanguage, options) {
	return axios.post(generateOcsUrl('/translation/translate', undefined, options), {
		text,
		fromLanguage,
		toLanguage,
	}, options)
}

export {
	fetchMessages,
	lookForNewMessages,
	getMessageContext,
	postNewMessage,
	deleteMessage,
	postRichObjectToConversation,
	updateLastReadMessage,
	addReactionToMessage,
	removeReactionFromMessage,
	getReactionsDetails,
	editMessage,
	getTranslationLanguages,
	translateText,
}
