<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Talk\Federation\Proxy\TalkV1\Controller;

use OCA\Talk\Exceptions\CannotReachRemoteException;
use OCA\Talk\Federation\Proxy\TalkV1\ProxyRequest;
use OCA\Talk\Federation\Proxy\TalkV1\UserConverter;
use OCA\Talk\Participant;
use OCA\Talk\ResponseDefinitions;
use OCA\Talk\Room;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;

/**
 * @psalm-import-type TalkCapabilities from ResponseDefinitions
 * @psalm-import-type TalkParticipant from ResponseDefinitions
 * @psalm-import-type TalkRoom from ResponseDefinitions
 */
class RoomController {
	public function __construct(
		protected ProxyRequest  $proxy,
		protected UserConverter $userConverter,
	) {
	}

	/**
	 * @see \OCA\Talk\Controller\RoomController::getParticipants()
	 *
	 * @param bool $includeStatus Include the user statuses
	 * @return DataResponse<Http::STATUS_OK, TalkParticipant[], array{X-Nextcloud-Has-User-Statuses?: bool}>
	 * @throws CannotReachRemoteException
	 *
	 * 200: Participants returned
	 * 403: Missing permissions for getting participants
	 */
	public function getParticipants(Room $room, Participant $participant): DataResponse {
		$proxy = $this->proxy->get(
			$participant->getAttendee()->getInvitedCloudId(),
			$participant->getAttendee()->getAccessToken(),
			$room->getRemoteServer() . '/ocs/v2.php/apps/spreed/api/v4/room/' . $room->getRemoteToken() . '/participants',
		);

		/** @var TalkParticipant[] $data */
		$data = $this->proxy->getOCSData($proxy);

		// FIXME post-load status information of now local users
		/** @var TalkParticipant[] $data */
		$data = $this->userConverter->convertAttendees($room, $data, 'actorType', 'actorId', 'displayName');
		$headers = [];
		if ($proxy->getHeader('X-Nextcloud-Has-User-Statuses')) {
			$headers['X-Nextcloud-Has-User-Statuses'] = (bool)$proxy->getHeader('X-Nextcloud-Has-User-Statuses');
		}

		return new DataResponse($data, Http::STATUS_OK, $headers);
	}

	/**
	 * @see \OCA\Talk\Controller\RoomController::joinFederatedRoom()
	 *
	 * @return DataResponse<Http::STATUS_OK|Http::STATUS_NOT_FOUND, array<empty>, array{X-Nextcloud-Talk-Proxy-Hash: string}>
	 * @throws CannotReachRemoteException
	 *
	 * 200: Federated user is still part of the room
	 * 404: Room not found
	 */
	public function joinFederatedRoom(Room $room, Participant $participant): DataResponse {
		$proxy = $this->proxy->post(
			$participant->getAttendee()->getInvitedCloudId(),
			$participant->getAttendee()->getAccessToken(),
			$room->getRemoteServer() . '/ocs/v2.php/apps/spreed/api/v4/room/' . $room->getRemoteToken() . '/federation/active',
		);

		$statusCode = $proxy->getStatusCode();
		if (!in_array($statusCode, [Http::STATUS_OK, Http::STATUS_NOT_FOUND], true)) {
			$this->proxy->logUnexpectedStatusCode(__METHOD__, $proxy->getStatusCode());
			throw new CannotReachRemoteException();
		}

		$headers = ['X-Nextcloud-Talk-Proxy-Hash' => $this->proxy->overwrittenRemoteTalkHash($proxy->getHeader('X-Nextcloud-Talk-Hash'))];

		return new DataResponse([], $statusCode, $headers);
	}

	/**
	 * @see \OCA\Talk\Controller\RoomController::getCapabilities()
	 *
	 * @return DataResponse<Http::STATUS_OK, TalkCapabilities|array<empty>, array{X-Nextcloud-Talk-Hash: string}>
	 * @throws CannotReachRemoteException
	 *
	 * 200: Get capabilities successfully
	 */
	public function getCapabilities(Room $room, Participant $participant): DataResponse {
		$proxy = $this->proxy->get(
			$participant->getAttendee()->getInvitedCloudId(),
			$participant->getAttendee()->getAccessToken(),
			$room->getRemoteServer() . '/ocs/v2.php/apps/spreed/api/v4/room/' . $room->getRemoteToken() . '/capabilities',
		);

		/** @var TalkCapabilities|array<empty> $data */
		$data = $this->proxy->getOCSData($proxy);

		$headers = [
			'X-Nextcloud-Talk-Hash' => $this->proxy->overwrittenRemoteTalkHash($proxy->getHeader('X-Nextcloud-Talk-Hash')),
		];

		return new DataResponse($data, Http::STATUS_OK, $headers);
	}
}
