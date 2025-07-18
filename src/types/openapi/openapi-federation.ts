/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export type paths = {
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/proxy/new/user-avatar/{size}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the avatar of a cloudId user when inviting users while creating a conversation */
        get: operations["avatar-get-user-proxy-avatar-without-room"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/proxy/new/user-avatar/{size}/dark": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the dark mode avatar of a cloudId user when inviting users while creating a conversation */
        get: operations["avatar-get-user-proxy-avatar-dark-without-room"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/proxy/{token}/user-avatar/{size}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the avatar of a cloudId user */
        get: operations["avatar-get-user-proxy-avatar"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/proxy/{token}/user-avatar/{size}/dark": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the dark mode avatar of a cloudId user */
        get: operations["avatar-get-user-proxy-avatar-dark"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/federation/invitation/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Accept a federation invites
         * @description 🚧 Draft: Still work in progress
         */
        post: operations["federation-accept-share"];
        /**
         * Decline a federation invites
         * @description 🚧 Draft: Still work in progress
         */
        delete: operations["federation-reject-share"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/federation/invitation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a list of federation invites
         * @description 🚧 Draft: Still work in progress
         */
        get: operations["federation-get-shares"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/room/{token}/federation/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Join room on the host server using the session id of the federated user
         * @description The session id can be null only for requests from Talk < 20.
         */
        post: operations["room-join-federated-room"];
        /** Leave room on the host server using the session id of the federated user */
        delete: operations["room-leave-federated-room"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        BaseMessage: {
            actorDisplayName: string;
            actorId: string;
            actorType: string;
            /** Format: int64 */
            expirationTimestamp: number;
            message: string;
            messageParameters: {
                [key: string]: components["schemas"]["RichObjectParameter"];
            };
            messageType: string;
            systemMessage: string;
        };
        Capabilities: {
            features: string[];
            "features-local": string[];
            config: {
                attachments: {
                    allowed: boolean;
                    folder?: string;
                };
                call: {
                    enabled: boolean;
                    "breakout-rooms": boolean;
                    recording: boolean;
                    /** Format: int64 */
                    "recording-consent": number;
                    "supported-reactions": string[];
                    /** @description List of file names relative to the spreed/img/backgrounds/ web path, e.g. `2_home.jpg` */
                    "predefined-backgrounds": string[];
                    /** @description List of file paths relative to the server web root with leading slash, e.g. `/apps/spreed/img/backgrounds/2_home.jpg` */
                    "predefined-backgrounds-v2": string[];
                    "can-upload-background": boolean;
                    "sip-enabled": boolean;
                    "sip-dialout-enabled": boolean;
                    "can-enable-sip": boolean;
                    "start-without-media": boolean;
                    /** Format: int64 */
                    "max-duration": number;
                    "blur-virtual-background": boolean;
                    "end-to-end-encryption": boolean;
                };
                chat: {
                    /** Format: int64 */
                    "max-length": number;
                    /** Format: int64 */
                    "read-privacy": number;
                    "has-translation-providers": boolean;
                    "has-translation-task-providers": boolean;
                    /** Format: int64 */
                    "typing-privacy": number;
                    /** Format: int64 */
                    "summary-threshold": number;
                };
                conversations: {
                    "can-create": boolean;
                    "force-passwords": boolean;
                    /** @enum {string} */
                    "list-style": "two-lines" | "compact";
                    /** Format: int64 */
                    "description-length": number;
                    /** Format: int64 */
                    "retention-event": number;
                    /** Format: int64 */
                    "retention-phone": number;
                    /** Format: int64 */
                    "retention-instant-meetings": number;
                };
                federation: {
                    enabled: boolean;
                    "incoming-enabled": boolean;
                    "outgoing-enabled": boolean;
                    "only-trusted-servers": boolean;
                };
                previews: {
                    /** Format: int64 */
                    "max-gif-size": number;
                };
                signaling: {
                    /** Format: int64 */
                    "session-ping-limit": number;
                    "hello-v2-token-key"?: string;
                };
                experiments: {
                    /** Format: int64 */
                    enabled: number;
                };
            };
            "config-local": {
                [key: string]: string[];
            };
            version: string;
        };
        ChatMessage: components["schemas"]["BaseMessage"] & {
            /** @enum {boolean} */
            deleted?: true;
            /** Format: int64 */
            id: number;
            isReplyable: boolean;
            markdown: boolean;
            reactions: {
                [key: string]: number;
            };
            reactionsSelf?: string[];
            referenceId: string;
            /** Format: int64 */
            timestamp: number;
            token: string;
            lastEditActorDisplayName?: string;
            lastEditActorId?: string;
            lastEditActorType?: string;
            /** Format: int64 */
            lastEditTimestamp?: number;
            silent?: boolean;
            /** Format: int64 */
            threadId?: number;
            isThread?: boolean;
        };
        ChatProxyMessage: components["schemas"]["BaseMessage"];
        FederationInvite: {
            /** Format: int64 */
            id: number;
            /** Format: int64 */
            state: number;
            localCloudId: string;
            localToken: string;
            /** Format: int64 */
            remoteAttendeeId: number;
            remoteServerUrl: string;
            remoteToken: string;
            roomName: string;
            userId: string;
            inviterCloudId: string;
            inviterDisplayName: string;
        };
        OCSMeta: {
            status: string;
            statuscode: number;
            message?: string;
            totalitems?: string;
            itemsperpage?: string;
        };
        PublicCapabilities: {
            spreed?: components["schemas"]["Capabilities"];
        };
        RichObjectParameter: {
            type: string;
            id: string;
            name: string;
            server?: string;
            link?: string;
            /** @enum {string} */
            "call-type"?: "one2one" | "group" | "public";
            "icon-url"?: string;
            "message-id"?: string;
            boardname?: string;
            stackname?: string;
            size?: string;
            path?: string;
            mimetype?: string;
            /** @enum {string} */
            "preview-available"?: "yes" | "no";
            mtime?: string;
            latitude?: string;
            longitude?: string;
            description?: string;
            thumb?: string;
            website?: string;
            /** @enum {string} */
            visibility?: "0" | "1";
            /** @enum {string} */
            assignable?: "0" | "1";
            conversation?: string;
            etag?: string;
            permissions?: string;
            width?: string;
            height?: string;
            blurhash?: string;
        };
        Room: {
            /** @description The unique identifier for the given actor type */
            actorId: string;
            /** @description The cloud id of the invited user */
            invitedActorId?: string;
            /** @description Actor type of the current user (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#attendee-types)) */
            actorType: string;
            /**
             * Format: int64
             * @description Unique attendee id
             */
            attendeeId: number;
            /**
             * Format: int64
             * @description Dedicated permissions for the current participant, if not `Custom` this are not the resulting permissions (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#attendee-permissions))
             */
            attendeePermissions: number;
            /** @description Unique dial-in authentication code for this user, when the conversation has SIP enabled (see `sipEnabled` attribute) */
            attendeePin: string | null;
            /** @description Version of conversation avatar used to easier expiration of the avatar in case a moderator updates it, since the avatar endpoint should be cached for 24 hours. (only available with `avatar` capability) */
            avatarVersion: string;
            /**
             * Format: int64
             * @description Breakout room configuration mode (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#breakout-room-modes)) (only available with `breakout-rooms-v1` capability)
             */
            breakoutRoomMode: number;
            /**
             * Format: int64
             * @description Breakout room status (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#breakout-room-status)) (only available with `breakout-rooms-v1` capability)
             */
            breakoutRoomStatus: number;
            /**
             * Format: int64
             * @description Combined flag of all participants in the current call (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#participant-in-call-flag), only available with `conversation-call-flags` capability)
             */
            callFlag: number;
            /**
             * Format: int64
             * @description Call permissions, if not `Custom` this are not the resulting permissions, if set they will reset after the end of the call (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#attendee-permissions))
             */
            callPermissions: number;
            /**
             * Format: int64
             * @description Type of call recording (see [Constants - Call recording status](https://nextcloud-talk.readthedocs.io/en/latest/constants#call-recording-status)) (only available with `recording-v1` capability)
             * @enum {integer}
             */
            callRecording: 0 | 1 | 2 | 3 | 4 | 5;
            /**
             * Format: int64
             * @description Timestamp when the call was started (only available with `recording-v1` capability)
             */
            callStartTime: number;
            /** @description Flag if the user can delete the conversation for everyone (not possible without moderator permissions or in one-to-one conversations) */
            canDeleteConversation: boolean;
            /** @description Whether the given user can enable SIP for this conversation. Note that when the token is not-numeric only, SIP can not be enabled even if the user is permitted and a moderator of the conversation */
            canEnableSIP: boolean;
            /** @description Flag if the user can leave the conversation (not possible for the last user with moderator permissions) */
            canLeaveConversation: boolean;
            /** @description Flag if the user can start a new call in this conversation (joining is always possible) (only available with `start-call-flag` capability) */
            canStartCall: boolean;
            /**
             * Format: int64
             * @description Default permissions for new participants (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#attendee-permissions))
             */
            defaultPermissions: number;
            /** @description Description of the conversation (can also be empty) (only available with `room-description` capability) */
            description: string;
            /** @description `name` if non-empty, otherwise it falls back to a list of participants */
            displayName: string;
            /** @description Flag if the conversation has an active call */
            hasCall: boolean;
            /** @description Flag if the conversation has a password */
            hasPassword: boolean;
            /**
             * Format: int64
             * @description Numeric identifier of the conversation
             */
            id: number;
            /** @description Flag if the conversation has a custom avatar (only available with `avatar` capability) */
            isCustomAvatar: boolean;
            /** @description Flag if the conversation is favorited by the user */
            isFavorite: boolean;
            /**
             * Format: int64
             * @description Timestamp of the last activity in the conversation, in seconds and UTC time zone
             */
            lastActivity: number;
            /**
             * Format: int64
             * @description ID of the last message read by every user that has read privacy set to public in a room. When the user themself has it set to private the value is `0` (only available with `chat-read-status` capability)
             */
            lastCommonReadMessage: number;
            /** @description Last message in a conversation if available, otherwise empty. **Note:** Even when given the message will not contain the `parent` or `reactionsSelf` attribute due to performance reasons */
            lastMessage?: components["schemas"]["RoomLastMessage"];
            /**
             * Format: int64
             * @description Timestamp of the user's session making the request
             */
            lastPing: number;
            /**
             * Format: int64
             * @description ID of the last read message in a room (only available with `chat-read-marker` capability)
             */
            lastReadMessage: number;
            /**
             * Format: int64
             * @description Listable scope for the room (only available with `listable-rooms` capability)
             */
            listable: number;
            /**
             * Format: int64
             * @description Webinar lobby restriction (0-1), if the participant is a moderator they can always join the conversation (only available with `webinary-lobby` capability) (See [Webinar lobby states](https://nextcloud-talk.readthedocs.io/en/latest/constants#webinar-lobby-states))
             */
            lobbyState: number;
            /**
             * Format: int64
             * @description Timestamp when the lobby will be automatically disabled (only available with `webinary-lobby` capability)
             */
            lobbyTimer: number;
            /**
             * Format: int64
             * @description Whether all participants can mention using `@all` or only moderators (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#mention-permissions)) (only available with `mention-permissions` capability)
             * @enum {integer}
             */
            mentionPermissions: 0 | 1;
            /**
             * Format: int64
             * @description The message expiration time in seconds in this chat. Zero if disabled. (only available with `message-expiration` capability)
             */
            messageExpiration: number;
            /** @description Name of the conversation (can also be empty) */
            name: string;
            /** Format: int64 */
            notificationCalls: number;
            /**
             * Format: int64
             * @description The notification level for the user (See [Participant notification levels](https://nextcloud-talk.readthedocs.io/en/latest/constants#participant-notification-levels))
             */
            notificationLevel: number;
            /** @description See [Object types](https://nextcloud-talk.readthedocs.io/en/latest/constants#object-types) documentation for explanation */
            objectId: string;
            /** @description The type of object that the conversation is associated with (See [Object types](https://nextcloud-talk.readthedocs.io/en/latest/constants#object-types)) */
            objectType: string;
            /**
             * Format: int64
             * @description "In call" flags of the user's session making the request (only available with `in-call-flags` capability)
             */
            participantFlags: number;
            /**
             * Format: int64
             * @description Permissions level of the current user
             */
            participantType: number;
            /**
             * Format: int64
             * @description Combined final permissions for the current participant, permissions are picked in order of attendee then call then default and the first which is `Custom` will apply (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#attendee-permissions))
             */
            permissions: number;
            /**
             * Format: int64
             * @description Read-only state for the current user (only available with `read-only-rooms` capability)
             */
            readOnly: number;
            /**
             * Format: int64
             * @description Whether recording consent is required before joining a call (Only 0 and 1 will be returned, see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#recording-consent-required)) (only available with `recording-consent` capability)
             */
            recordingConsent: number;
            remoteServer?: string;
            remoteToken?: string;
            /** @description `'0'` if not connected, otherwise an up to 512 character long string that is the identifier of the user's session making the request. Should only be used to pre-check if the user joined already with this session, but this might be outdated by the time of usage, so better check via [Get list of participants in a conversation](https://nextcloud-talk.readthedocs.io/en/latest/participant/#get-list-of-participants-in-a-conversation) */
            sessionId: string;
            /**
             * Format: int64
             * @description SIP enable status (see [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants#sip-states))
             */
            sipEnabled: number;
            /** @description Optional: Only available for one-to-one conversations, when `includeStatus=true` is set and the user has a status */
            status?: string;
            /**
             * Format: int64
             * @description Optional: Only available for one-to-one conversations, when `includeStatus=true` is set and the user has a status, can still be null even with a status
             */
            statusClearAt?: number | null;
            /** @description Optional: Only available for one-to-one conversations, when `includeStatus=true` is set and the user has a status, can still be null even with a status */
            statusIcon?: string | null;
            /** @description Optional: Only available for one-to-one conversations, when `includeStatus=true` is set and the user has a status, can still be null even with a status */
            statusMessage?: string | null;
            /** @description Token identifier of the conversation which is used for further interaction */
            token: string;
            /**
             * Format: int64
             * @description See list of conversation types in the [constants list](https://nextcloud-talk.readthedocs.io/en/latest/constants/#conversation-types)
             */
            type: number;
            /** @description Flag if the user was mentioned since their last visit */
            unreadMention: boolean;
            /** @description Flag if the user was mentioned directly (ignoring `@all` mentions) since their last visit (only available with `direct-mention-flag` capability) */
            unreadMentionDirect: boolean;
            /**
             * Format: int64
             * @description Number of unread chat messages in the conversation (only available with `chat-v2` capability)
             */
            unreadMessages: number;
            /** @description Flag if the conversation is archived by the user (only available with `archived-conversations-v2` capability) */
            isArchived: boolean;
            /** @description Required capability: `important-conversations` */
            isImportant: boolean;
            /** @description Required capability: `sensitive-conversations` */
            isSensitive: boolean;
        };
        RoomLastMessage: components["schemas"]["ChatMessage"] | components["schemas"]["ChatProxyMessage"];
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
    "avatar-get-user-proxy-avatar-without-room": {
        parameters: {
            query: {
                /** @description Federation CloudID to get the avatar for */
                cloudId: string;
                /** @description Theme used for background */
                darkTheme?: 0 | 1;
            };
            header: {
                /** @description Set to 1 when the request is performed by another Nextcloud Server to indicate a federation request */
                "x-nextcloud-federation"?: string;
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                /** @description Avatar size */
                size: 64 | 512;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User avatar returned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    "avatar-get-user-proxy-avatar-dark-without-room": {
        parameters: {
            query: {
                /** @description Federation CloudID to get the avatar for */
                cloudId: string;
            };
            header: {
                /** @description Set to 1 when the request is performed by another Nextcloud Server to indicate a federation request */
                "x-nextcloud-federation"?: string;
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                /** @description Avatar size */
                size: 64 | 512;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User avatar returned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    "avatar-get-user-proxy-avatar": {
        parameters: {
            query: {
                /** @description Federation CloudID to get the avatar for */
                cloudId: string;
                /** @description Theme used for background */
                darkTheme?: 0 | 1;
            };
            header: {
                /** @description Set to 1 when the request is performed by another Nextcloud Server to indicate a federation request */
                "x-nextcloud-federation"?: string;
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                token: string;
                /** @description Avatar size */
                size: 64 | 512;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User avatar returned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    "avatar-get-user-proxy-avatar-dark": {
        parameters: {
            query: {
                /** @description Federation CloudID to get the avatar for */
                cloudId: string;
            };
            header: {
                /** @description Set to 1 when the request is performed by another Nextcloud Server to indicate a federation request */
                "x-nextcloud-federation"?: string;
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                token: string;
                /** @description Avatar size */
                size: 64 | 512;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User avatar returned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    "federation-accept-share": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                /** @description ID of the share */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Invite accepted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: components["schemas"]["Room"];
                        };
                    };
                };
            };
            /** @description Invite can not be accepted (maybe it was accepted already) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error: string;
                            };
                        };
                    };
                };
            };
            /** @description Invite can not be found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error: string;
                            };
                        };
                    };
                };
            };
            /** @description Remote server could not be reached to notify about the acceptance */
            410: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error: string;
                            };
                        };
                    };
                };
            };
        };
    };
    "federation-reject-share": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                /** @description ID of the share */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Invite declined successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: unknown;
                        };
                    };
                };
            };
            /** @description Invite was already accepted, use the "Remove the current user from a room" endpoint instead */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error: string;
                            };
                        };
                    };
                };
            };
            /** @description Invite can not be found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error: string;
                            };
                        };
                    };
                };
            };
        };
    };
    "federation-get-shares": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Get list of received federation invites successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: components["schemas"]["FederationInvite"][];
                        };
                    };
                };
            };
        };
    };
    "room-join-federated-room": {
        parameters: {
            query?: never;
            header: {
                /** @description Set to 1 when the request is performed by another Nextcloud Server to indicate a federation request */
                "x-nextcloud-federation"?: string;
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v4";
                /** @description Token of the room */
                token: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @description Federated session id to join with */
                    sessionId?: string | null;
                };
            };
        };
        responses: {
            /** @description Federated user joined the room */
            200: {
                headers: {
                    "X-Nextcloud-Talk-Hash"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: components["schemas"]["Room"];
                        };
                    };
                };
            };
            /** @description Room not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: unknown;
                        };
                    };
                };
            };
        };
    };
    "room-leave-federated-room": {
        parameters: {
            query: {
                /** @description Federated session id to leave with */
                sessionId: string;
            };
            header: {
                /** @description Set to 1 when the request is performed by another Nextcloud Server to indicate a federation request */
                "x-nextcloud-federation"?: string;
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v4";
                /** @description Token of the room */
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully left the room */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: unknown;
                        };
                    };
                };
            };
            /** @description Room not found (non-federation request) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: unknown;
                        };
                    };
                };
            };
        };
    };
}
