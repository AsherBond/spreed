<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcAppSettingsDialog :open.sync="showSettings"
		:name="t('spreed', 'Talk settings')"
		show-navigation>
		<!-- Custom settings sections registered via OCA.Talk.Settings -->
		<NcAppSettingsSection v-for="{ id, name, element } in customSettingsSections"
			:id="id"
			:key="id"
			:name="name"
			class="app-settings-section">
			<component :is="element" />
		</NcAppSettingsSection>

		<NcAppSettingsSection id="devices"
			:name="t('spreed', 'Choose devices')"
			class="app-settings-section">
			<MediaDevicesPreview />
		</NcAppSettingsSection>
		<NcAppSettingsSection v-if="!isGuest"
			id="attachments"
			:name="t('spreed', 'Attachments folder')"
			class="app-settings-section">
			<em class="app-settings-section__hint">
				{{ locationHint }}
			</em>
			<div class="app-settings-section__wrapper">
				<p class="app-settings-section__input" @click="showFilePicker = true">
					{{ attachmentFolder }}
				</p>
				<NcButton type="primary"
					@click="showFilePicker = true">
					{{ t('spreed', 'Browse …') }}
				</NcButton>
				<FilePickerVue v-if="showFilePicker"
					:name="t('spreed', 'Select location for attachments')"
					:path="attachmentFolder"
					container=".app-settings-section__wrapper"
					:buttons="filePickerButtons"
					:multiselect="false"
					:mimetype-filter="['httpd/unix-directory']"
					allow-pick-directory
					@close="showFilePicker = false" />
			</div>
		</NcAppSettingsSection>
		<NcAppSettingsSection v-if="!isGuest"
			id="privacy"
			:name="t('spreed', 'Privacy')"
			class="app-settings-section">
			<NcCheckboxRadioSwitch id="read_status_privacy"
				:checked="readStatusPrivacyIsPublic"
				:disabled="privacyLoading"
				type="switch"
				class="checkbox"
				@update:checked="toggleReadStatusPrivacy">
				{{ t('spreed', 'Share my read-status and show the read-status of others') }}
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-if="supportTypingStatus"
				id="typing_status_privacy"
				:checked="typingStatusPrivacyIsPublic"
				:disabled="privacyLoading"
				type="switch"
				class="checkbox"
				@update:checked="toggleTypingStatusPrivacy">
				{{ t('spreed', 'Share my typing-status and show the typing-status of others') }}
			</NcCheckboxRadioSwitch>
		</NcAppSettingsSection>
		<NcAppSettingsSection id="sounds"
			:name="t('spreed', 'Sounds')"
			class="app-settings-section">
			<NcCheckboxRadioSwitch id="play_sounds"
				:checked="shouldPlaySounds"
				:disabled="playSoundsLoading"
				type="switch"
				class="checkbox"
				@update:checked="togglePlaySounds">
				{{ t('spreed', 'Play sounds when participants join or leave a call') }}
			</NcCheckboxRadioSwitch>
			<em>{{ t('spreed', 'Sounds can currently not be played on iPad and iPhone devices due to technical restrictions by the manufacturer.') }}</em>

			<a :href="settingsUrl"
				target="_blank"
				rel="noreferrer nofollow"
				class="external">
				{{ t('spreed', 'Sounds for chat and call notifications can be adjusted in the personal settings.') }} ↗
			</a>
		</NcAppSettingsSection>
		<NcAppSettingsSection id="performance"
			:name="t('spreed', 'Performance')"
			class="app-settings-section">
			<NcCheckboxRadioSwitch id="blur-call-background"
				:checked="isBackgroundBlurred === 'yes'"
				:indeterminate="isBackgroundBlurred === ''"
				type="checkbox"
				class="checkbox"
				disabled>
				{{ t('spreed', 'Blur background image in the call (may increase GPU load)') }}
			</NcCheckboxRadioSwitch>
			<a :href="themingUrl"
				target="_blank"
				rel="noreferrer nofollow"
				class="external">
				{{ t('spreed', 'Background blur for Nextcloud instance can be adjusted in the theming settings.') }} ↗
			</a>
		</NcAppSettingsSection>
		<NcAppSettingsSection v-if="!disableKeyboardShortcuts"
			id="shortcuts"
			:name="t('spreed', 'Keyboard shortcuts')">
			<em>{{ t('spreed', 'Speed up your Talk experience with these quick shortcuts.') }}</em>

			<dl>
				<div>
					<dt><kbd>C</kbd></dt>
					<dd class="shortcut-description">
						{{ t('spreed', 'Focus the chat input') }}
					</dd>
				</div>
				<div>
					<dt><kbd>Esc</kbd></dt>
					<dd class="shortcut-description">
						{{ t('spreed', 'Unfocus the chat input to use shortcuts') }}
					</dd>
				</div>
				<div>
					<dt><kbd>Ctrl</kbd> + <kbd>↑</kbd></dt>
					<dd class="shortcut-description">
						{{ t('spreed', 'Edit your last message') }}
					</dd>
				</div>
				<div>
					<dt><kbd>F</kbd></dt>
					<dd class="shortcut-description">
						{{ t('spreed', 'Fullscreen the chat or call') }}
					</dd>
				</div>
				<div>
					<dt><kbd>Ctrl</kbd> + <kbd>F</kbd></dt>
					<dd class="shortcut-description">
						{{ t('spreed', 'Search') }}
					</dd>
				</div>
			</dl>

			<h3>{{ t('spreed', 'Shortcuts while in a call') }}</h3>
			<dl>
				<div>
					<dt><kbd>V</kbd></dt>
					<dd class="shortcut-description">
						{{ t('spreed', 'Camera on and off') }}
					</dd>
				</div>
				<div>
					<dt><kbd>M</kbd></dt>
					<dd class="shortcut-description">
						{{ t('spreed', 'Microphone on and off') }}
					</dd>
				</div>
				<div>
					<dt><kbd>{{ t('spreed', 'Space bar') }}</kbd></dt>
					<dd class="shortcut-description">
						{{ t('spreed', 'Push to talk or push to mute') }}
					</dd>
				</div>
				<div>
					<dt><kbd>R</kbd></dt>
					<dd class="shortcut-description">
						{{ t('spreed', 'Raise or lower hand') }}
					</dd>
				</div>
			</dl>
		</NcAppSettingsSection>
	</NcAppSettingsDialog>
</template>

<script>
import axios from '@nextcloud/axios'
import { showError, showSuccess } from '@nextcloud/dialogs'
import { FilePickerVue } from '@nextcloud/dialogs/filepicker.js'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'

import NcAppSettingsDialog from '@nextcloud/vue/dist/Components/NcAppSettingsDialog.js'
import NcAppSettingsSection from '@nextcloud/vue/dist/Components/NcAppSettingsSection.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

import MediaDevicesPreview from './MediaDevicesPreview.vue'

import { PRIVACY } from '../../constants.js'
import BrowserStorage from '../../services/BrowserStorage.js'
import { getTalkConfig } from '../../services/CapabilitiesManager.ts'
import { useCustomSettings } from '../../services/SettingsAPI.ts'
import { useSettingsStore } from '../../stores/settings.js'
import { useSoundsStore } from '../../stores/sounds.js'

const isBackgroundBlurred = loadState('spreed', 'force_enable_blur_filter', '')
const supportTypingStatus = getTalkConfig('local', 'chat', 'typing-privacy') !== undefined

export default {
	name: 'SettingsDialog',

	components: {
		FilePickerVue,
		MediaDevicesPreview,
		NcAppSettingsDialog,
		NcAppSettingsSection,
		NcButton,
		NcCheckboxRadioSwitch,
	},

	setup() {
		const settingsStore = useSettingsStore()
		const soundsStore = useSoundsStore()
		const { customSettingsSections } = useCustomSettings()

		return {
			settingsStore,
			soundsStore,
			supportTypingStatus,
			isBackgroundBlurred,
			customSettingsSections,
		}
	},

	data() {
		return {
			showSettings: false,
			showFilePicker: false,
			attachmentFolderLoading: true,
			privacyLoading: false,
			playSoundsLoading: false,
		}
	},

	computed: {
		shouldPlaySounds() {
			return this.soundsStore.shouldPlaySounds
		},

		attachmentFolder() {
			return this.$store.getters.getAttachmentFolder()
		},

		locationHint() {
			return t('spreed', 'Choose the folder in which attachments should be saved.')
		},

		isGuest() {
			return !this.$store.getters.getUserId()
		},

		readStatusPrivacyIsPublic() {
			return this.settingsStore.readStatusPrivacy === PRIVACY.PUBLIC
		},

		typingStatusPrivacyIsPublic() {
			return this.settingsStore.typingStatusPrivacy === PRIVACY.PUBLIC
		},

		settingsUrl() {
			return generateUrl('/settings/user/notifications')
		},

		themingUrl() {
			return generateUrl('/settings/user/theming')
		},

		disableKeyboardShortcuts() {
			return OCP.Accessibility.disableKeyboardShortcuts()
		},

		filePickerButtons() {
			return [{
				label: t('spreed', 'Choose'),
				callback: (nodes) => this.selectAttachmentFolder(nodes),
				type: 'primary'
			}]
		},
	},

	created() {
		const blurred = BrowserStorage.getItem('background-blurred')
		if (blurred === 'false' && isBackgroundBlurred === '') {
			console.debug('Blur was disabled intentionally, propagating last choice to server')
			axios.post(generateOcsUrl('apps/provisioning_api/api/v1/config/users/theming/force_enable_blur_filter'),
				{ configValue: 'no' })
		}
		BrowserStorage.removeItem('background-blurred')
	},

	mounted() {
		subscribe('show-settings', this.handleShowSettings)
		this.attachmentFolderLoading = false
	},

	methods: {
		t,
		async selectAttachmentFolder(nodes) {
			const path = nodes[0]?.path
			if (!path) {
				return
			}

			console.debug(`Path '${path}' selected for talk attachments`)
			if (path !== '' && !path.startsWith('/')) {
				throw new Error(t('spreed', 'Invalid path selected'))
			}

			this.attachmentFolderLoading = true
			try {
				this.$store.dispatch('setAttachmentFolder', path)
			} catch (exception) {
				showError(t('spreed', 'Error while setting attachment folder'))
			}
			this.attachmentFolderLoading = false
		},

		async toggleReadStatusPrivacy() {
			this.privacyLoading = true
			try {
				await this.settingsStore.updateReadStatusPrivacy(
					this.readStatusPrivacyIsPublic ? PRIVACY.PRIVATE : PRIVACY.PUBLIC
				)
				showSuccess(t('spreed', 'Your privacy setting has been saved'))
			} catch (exception) {
				showError(t('spreed', 'Error while setting read status privacy'))
			}
			this.privacyLoading = false
		},

		async toggleTypingStatusPrivacy() {
			this.privacyLoading = true
			try {
				await this.settingsStore.updateTypingStatusPrivacy(
					this.typingStatusPrivacyIsPublic ? PRIVACY.PRIVATE : PRIVACY.PUBLIC
				)
				showSuccess(t('spreed', 'Your privacy setting has been saved'))
			} catch (exception) {
				showError(t('spreed', 'Error while setting typing status privacy'))
			}
			this.privacyLoading = false
		},

		async togglePlaySounds() {
			this.playSoundsLoading = true
			try {
				try {
					await this.soundsStore.setShouldPlaySounds(!this.shouldPlaySounds)
				} catch (e) {
					showError(t('spreed', 'Failed to save sounds setting'))
				}
				showSuccess(t('spreed', 'Sounds setting saved'))
			} catch (exception) {
				showError(t('spreed', 'Error while saving sounds setting'))
			}
			this.playSoundsLoading = false
		},

		handleShowSettings() {
			this.showSettings = true
		},

		beforeDestroy() {
			unsubscribe('show-settings', this.handleShowSettings)
		},
	},
}
</script>

<style lang="scss" scoped>

.app-settings-section {
	margin-bottom: 80px;

	&.last {
		margin-bottom: 0;
	}

	&__title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__hint {
		color: var(--color-text-maxcontrast);
		padding: 8px 0;
	}

	&__wrapper {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	// Copy-pasted styles from NcInputField
	&__input {
		width: 300px;
		height: var(--default-clickable-area);
		line-height: var(--default-clickable-area);
		padding-inline: 12px 6px;
		border: var(--border-width-input, 2px) solid var(--color-border-maxcontrast);
		border-radius: var(--border-radius-large);
		font-size: var(--default-font-size);
		text-overflow: ellipsis;
		opacity: 0.7;
		color: var(--color-main-text);
		background-color: var(--color-main-background);
		cursor: pointer;
	}

	.shortcut-description {
		width: calc(100% - 160px);
	}
}

</style>
