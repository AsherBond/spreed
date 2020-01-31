# Participant API

Base endpoint is: `/ocs/v2.php/apps/spreed/api/v1`

## Get list of participants in a conversation

* Method: `GET`
* Endpoint: `/room/{token}/participants`

* Response:
    - Header:
        + `200 OK`
        + `403 Forbidden` When the participant is a guest
        + `404 Not Found` When the conversation could not be found for the participant
        + `412 Precondition Failed` When the lobby is active and the user is not a moderator

    - Data:
        Array of participants, each participant has at least:

        field | type | Description
        ------|------|------------
        `userId` | string | Is empty for guests
        `displayName` | string | Can be empty for guests
        `participantType` | int | Permissions level of the participant
        `lastPing` | int | Timestamp of the last ping of the user (should be used for sorting)
        `sessionId` | string | `'0'` if not connected, otherwise a 512 character long string

## Add a participant to a conversation

* Method: `POST`
* Endpoint: `/room/{token}/participants`
* Data:

    field | type | Description
    ------|------|------------
    `newParticipant` | string | User, group, email or circle to add
    `source` | string | Source of the participant(s) as returned by the autocomplete suggestion endpoint (default is `users`)

* Response:
    - Header:
        + `200 OK`
        + `400 Bad Request` When the source type is unknown, currently `users`, `groups`, `emails` are supported. `circles` are supported with `circles-support` capability
        + `400 Bad Request` When the conversation is a one-to-one conversation
        + `403 Forbidden` When the current user is not a moderator or owner
        + `404 Not Found` When the conversation could not be found for the participant
        + `404 Not Found` When the user or group to add could not be found

    - Data:

        field | type | Description
        ------|------|------------
        `type` | int | In case the conversation type changed, the new value is returned

## Delete a participant from a conversation

* Method: `DELETE`
* Endpoint: `/room/{token}/participants`
* Data:

    field | type | Description
    ------|------|------------
    `participant` | string | User to remove

* Response:
    - Header:
        + `200 OK`
        + `400 Bad Request` When the participant is a moderator or owner
        + `400 Bad Request` When there are no other moderators or owners left
        + `403 Forbidden` When the current user is not a moderator or owner
        + `403 Forbidden` When the participant to remove is an owner
        + `404 Not Found` When the conversation could not be found for the participant
        + `404 Not Found` When the participant to remove could not be found

## Remove yourself from a conversation

* Method: `DELETE`
* Endpoint: `/room/{token}/participants/self`

* Response:
    - Header:
        + `200 OK`
        + `400 Bad Request` When the participant is a moderator or owner and there are no other moderators or owners left.
        + `404 Not Found` When the conversation could not be found for the participant

## Remove a guest from a conversation

* Method: `DELETE`
* Endpoint: `/room/{token}/participants/guests`
* Data:

    field | type | Description
    ------|------|------------
    `participant` | string | Session ID of the guest to remove

* Response:
    - Header:
        + `200 OK`
        + `400 Bad Request` When the target participant is not a guest
        + `403 Forbidden` When the current user is not a moderator or owner
        + `404 Not Found` When the conversation could not be found for the participant
        + `404 Not Found` When the target participant could not be found

## Join a conversation (available for call and chat)

* Method: `POST`
* Endpoint: `/room/{token}/participants/active`
* Data:

    field | type | Description
    ------|------|------------
    `password` | string | Optional: Password is only required for users which are of type `4` or `5` and only when the conversation has `hasPassword` set to true.

* Response:
    - Header:
        + `200 OK`
        + `403 Forbidden` When the password is required and didn't match
        + `404 Not Found` When the conversation could not be found for the participant

    - Data:

        field | type | Description
        ------|------|------------
        `sessionId` | string | 512 character long string

## Leave a conversation (not available for call and chat anymore)

* Method: `DELETE`
* Endpoint: `/room/{token}/participants/active`

* Response:
    - Header:
        + `200 OK`
        + `404 Not Found` When the conversation could not be found for the participant

## Promote a user or guest to moderator

* Method: `POST`
* Endpoint: `/room/{token}/moderators`
* Data:

    field | type | Description
    ------|------|------------
    `participant` | string or null | User to promote
    `sessionId` | string or null | Guest session to promote

* Response:
    - Header:
        + `200 OK`
        + `400 Bad Request` When the participant to promote is not a normal user (type `3`) or normal guest (type `4`)
        + `403 Forbidden` When the current user is not a moderator or owner
        + `403 Forbidden` When the participant to remove is an owner
        + `404 Not Found` When the conversation could not be found for the participant
        + `404 Not Found` When the participant to remove could not be found

## Demote a moderator to user or guest

* Method: `DELETE`
* Endpoint: `/room/{token}/moderators`
* Data:

    field | type | Description
    ------|------|------------
    `participant` | string or null | User to demote
    `sessionId` | string or null | Guest session to demote

* Response:
    - Header:
        + `200 OK`
        + `400 Bad Request` When the participant to demote is not a moderator (type `2`) or guest moderator (type `6`)
        + `403 Forbidden` When the current participant is not a moderator or owner
        + `403 Forbidden` When the current participant tries to demote themselves
        + `404 Not Found` When the conversation could not be found for the participant
        + `404 Not Found` When the participant to demote could not be found

## Set display name as a guest

* Method: `POST`
* Endpoint: `/guest/{token}/name`
* Data:

    field | type | Description
    ------|------|------------
    `displayName` | string | The new display name

* Response:
    - Header:
        + `200 OK`
        + `403 Forbidden` When the current user is not a guest
        + `404 Not Found` When the conversation could not be found for the participant
