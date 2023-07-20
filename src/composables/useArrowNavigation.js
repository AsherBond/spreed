/*
 * @copyright Copyright (c) 2023 Maksim Sukharev <antreesy.web@gmail.com>
 *
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { ref } from 'vue'

/**
 * Mount navigation according to https://www.w3.org/WAI/GL/wiki/Using_ARIA_menus
 * ArrowDown or ArrowUp keys to move through the itemElements list
 * Enter key to select focused element
 * Escape key - to return focus to the default element, if one of the items is focused already
 * Backspace key - to return focus to the default element, if one of the items is focused already
 */
export function useArrowNavigation() {
	const listRef = ref(null)
	const defaultRef = ref(null)
	const itemElements = ref([])
	const focusedIndex = ref(null)

	/**
	 * Add event listeners for navigation list and set a default focus element
	 *
	 * @param {import('vue').Ref} listElementRef component ref to mount navigation
	 * @param {import('vue').Ref} defaultElementRef component ref to return focus to
	 */
	function mountArrowNavigation(listElementRef, defaultElementRef) {
		listRef.value = listElementRef
		defaultRef.value = defaultElementRef

		listRef.value.$el.addEventListener('keydown', (event) => {
			if (itemElements.value?.length) {
				if (event.key === 'ArrowDown') {
					focusNextElement(event)
				} else if (event.key === 'ArrowUp') {
					focusPrevElement(event)
				} else if (event.key === 'Enter') {
					focusFirstElementIfNotFocused(event)
				} else if (event.key === 'Escape' || event.key === 'Backspace') {
					focusDefaultElement(event)
				}
			}
		})
	}

	/**
	 * Collect all DOM elements specified by selector
	 *
	 * @param {string} selector selector to look for
	 */
	function initializeNavigation(selector) {
		itemElements.value = Array.from(listRef.value.$el.querySelectorAll(selector))
		focusedIndex.value = null

		itemElements.value.forEach((item, index) => {
			item.addEventListener('focus', (event) => {
				focusedIndex.value = index
			})

			item.addEventListener('blur', (event) => {
				if (!itemElements.value.includes(event.relatedTarget)) {
					focusedIndex.value = null
				}
			})
		})
	}

	/**
	 * Focus natively the DOM element specified by index
	 *
	 * @param {object} index the item index
	 */
	function nativelyFocusElement(index) {
		focusedIndex.value = index
		itemElements.value[index].focus()
	}

	/**
	 * Focus the default component ('focus' method should be exposed)
	 *
	 * @param {Event} event Keydown event
	 */
	function focusDefaultElement(event) {
		if (focusedIndex.value !== null) {
			event.preventDefault()
			focusedIndex.value = null
			defaultRef.value.focus()
		}
	}

	/**
	 * Focus the first element if not focused yet, otherwise proceed
	 *
	 * @param {Event} [event] Keydown event to prevent, if defined and not focused yet
	 *
	 * @return {boolean} If first element was focused or not
	 */
	function focusFirstElementIfNotFocused(event) {
		const isFirstElementNotFocused = focusedIndex.value === null
		if (isFirstElementNotFocused) {
			event?.preventDefault()
			nativelyFocusElement(0)
		}
		return isFirstElementNotFocused
	}

	/**
	 * Focus the next element
	 *
	 * @param {Event} event Keydown event
	 */
	function focusNextElement(event) {
		event.preventDefault()
		if (focusFirstElementIfNotFocused()) {
			return
		}

		if (focusedIndex.value < itemElements.value.length - 1) {
			nativelyFocusElement(focusedIndex.value + 1)
		} else {
			nativelyFocusElement(0)
		}
	}

	/**
	 * Focus the previous element
	 *
	 * @param {Event} event Keydown event
	 */
	function focusPrevElement(event) {
		event.preventDefault()
		if (focusFirstElementIfNotFocused()) {
			return
		}

		if (focusedIndex.value > 0) {
			nativelyFocusElement(focusedIndex.value - 1)
		} else {
			nativelyFocusElement(itemElements.value.length - 1)
		}
	}

	return {
		initializeNavigation,
		mountArrowNavigation,
	}
}
