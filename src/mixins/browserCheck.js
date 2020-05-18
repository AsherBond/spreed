/**
 * @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
 *
 * @author Marco Ambrosini <marcoambrosini@pm.me>
 *
 * @license GNU AGPL version 3 or any later version
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

import { showError } from '@nextcloud/dialogs'
import UAParser from 'ua-parser-js'

const browserCheck = {
	methods: {
		checkBrowser() {
			console.info('Detected browser ' + this.browser.name + ' ' + this.browser.version)
			if (!this.isFullySupported) {
				showError(
					this.unsupportedWarning,
					{
						timeout: 0,
					})
			}
		},
	},
	computed: {
		browser() {
			const parser = new UAParser()
			return parser.getBrowser()
		},

		isFirefox() {
			return this.browser.name === 'Firefox'
		},
		isChrome() {
			return this.browser.name === 'Chrome' || this.browser.name === 'Chromium'
		},
		isSafari() {
			return this.browser.name === 'Safari' || this.browser.name === 'Mobile Safari'
		},
		isEdge() {
			return this.browser.name === 'Edge'
		},
		isIE() {
			return this.browser.name === 'IE' || this.browser.name === 'IEMobile'
		},

		isFullySupported() {
			return (this.isFirefox && this.browser.version >= 52)
			|| (this.isChrome && this.browser.version >= 49)
			|| (this.isSafari && this.browser.version >= 12)
			|| this.isEdge
		},
		// Disable the call button and show the tooltip
		blockCalls() {
			return (this.isFirefox && this.browser.version < 52)
			|| (this.isChrome && this.browser.version < 49)
			|| (this.isSafari && this.browser.version < 12)
			|| this.isIE
		},
		// Used both in the toast and in the call button tooltip
		unsupportedWarning() {
			return t('spreed', "The browser you're using is not fully supported by Nextcloud Talk. Please use the latest version of Mozilla Firefox, Microsoft Edge, Google Chrome or Apple Safari.")
		},
		// Used in CallButton.vue
		callButtonTooltipText() {
			if (this.blockCalls) {
				return this.unsupportedWarning
			} else {
				// Passing a falsy value into the content of the tooltip
				// is the only way to disable it conditionally.
				return false
			}
		},

	},
}

export default browserCheck
