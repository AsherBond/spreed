/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author Joas Schilling <coding@schilljs.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { createPinia, PiniaVuePlugin } from 'pinia'
import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import vOutsideEvents from 'vue-outside-events'
import VueShortKey from 'vue-shortkey'
import Vuex from 'vuex'

import { translate, translatePlural } from '@nextcloud/l10n'

import FilesSidebarCallViewApp from './FilesSidebarCallViewApp.vue'
import FilesSidebarTabApp from './FilesSidebarTabApp.vue'

import './init.js'
import PrivateTalk from './mainFilesSidebarLoader.js'
import store from './store/index.js'
import FilesSidebarCallView from './views/FilesSidebarCallView.js'

// Leaflet icon patch
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package

// eslint-disable-next-line
import 'leaflet-defaulticon-compatibility'

Vue.prototype.t = translate
Vue.prototype.n = translatePlural
Vue.prototype.OC = OC
Vue.prototype.OCA = OCA

Vue.use(PiniaVuePlugin)
Vue.use(Vuex)
Vue.use(VueShortKey, { prevent: ['input', 'textarea', 'div'] })
Vue.use(vOutsideEvents)
Vue.use(VueObserveVisibility)

const pinia = createPinia()

store.dispatch('setMainContainerSelector', '.talkChatTab')

const newCallView = () => new Vue({
	store,
	pinia,
	render: h => h(FilesSidebarCallViewApp),
})

const newTab = () => new Vue({
	store,
	pinia,
	id: 'talk-chat-tab',
	render: h => h(FilesSidebarTabApp),
})

Object.assign(window.OCA.Talk, {
	newCallView,
	newTab,
	store,
})

export const mountSidebar = (mountEl) => {
	if (OCA.Files?.Sidebar) {
		OCA.Files.Sidebar.registerSecondaryView(new FilesSidebarCallView())
		PrivateTalk.tabInstance = OCA.Talk.newTab()
		PrivateTalk.tabInstance.$mount(mountEl)
	}
}
