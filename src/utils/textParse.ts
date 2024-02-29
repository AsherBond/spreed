/**
 * @copyright Copyright (c) 2024 Dorra Jaouad <dorra.jaoued1@gmail.com>
 *
 * @author Dorra Jaouad <dorra.jaoued1@gmail.com>
 * @author Maksim Sukharev <antreesy.web@gmail.com>
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

import { getBaseUrl } from '@nextcloud/router'

import type { ChatMessage, Mention } from '../types'

/**
 * Parse message text to return proper formatting for mentions
 *
 * @param text The string to parse
 * @param parameters The parameters that contain the mentions
 */
function parseMentions(text: string, parameters: ChatMessage['messageParameters']): string {
	for (const key of Object.keys(parameters).filter(key => key.startsWith('mention'))) {
		const value: Mention = parameters[key]
		let mention = ''

		if (key.startsWith('mention-call') && value.type === 'call') {
			mention = '@all'
		} else if (key.startsWith('mention-federated-user') && value.type === 'user') {
			const server = value?.server ?? getBaseUrl().replace('https://', '')
			mention = `@"federated_user/${value.id}@${server}"`
		} else if (key.startsWith('mention-group') && value.type === 'user-group') {
			mention = `@"group/${value.id}"`
		} else if (key.startsWith('mention-user') && value.type === 'user') {
			mention = value.id.includes(' ') ? `@"${value.id}"` : `@${value.id}`
		}

		if (mention) {
			text = text.replace(new RegExp(`{${key}}`, 'g'), mention)
		}
	}
	return text
}

/**
 * Parse special symbols in text like &amp; &lt; &gt; &sect;
 * FIXME upstream: https://github.com/nextcloud-libraries/nextcloud-vue/issues/4492
 *
 * @param text The string to parse
 */
function parseSpecialSymbols(text: string): string {
	const temp = document.createElement('textarea')
	temp.innerHTML = text.replace(/&/gmi, '&amp;')
	text = temp.value.replace(/&amp;/gmi, '&').replace(/&lt;/gmi, '<')
		.replace(/&gt;/gmi, '>').replace(/&sect;/gmi, '§')
		.replace(/^\s+|\s+$/g, '') // remove trailing and leading whitespaces
		.replace(/\r\n|\n|\r/gm, '\n') // remove line breaks
	return text
}

export {
	parseSpecialSymbols,
	parseMentions,
}
