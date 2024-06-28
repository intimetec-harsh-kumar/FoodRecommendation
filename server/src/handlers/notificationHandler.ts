import NotificationService from "../services/notificationService";

class NotificationHandler {
	public async handleViewNotifications(
		callback: (response: {
			notification: {
				id: number;
				notification_type_id: number;
				message: string;
				Date: any;
			}[];
		}) => void,
		notificationTypeId?: number
	): Promise<void> {
		try {
			const notification: any = await NotificationService.getNotification(
				notificationTypeId
			);
			callback({ notification: notification });
		} catch (error) {
			console.error("Error retrieving notification:", error);
		}
	}

	public async handleSendNotifications(
		foodItemIdsToRollOutForNextDay: any,
		callback: (response: { message: string }) => void
	) {
		try {
			await NotificationService.sendFoodItemNotificationForNextDay(
				foodItemIdsToRollOutForNextDay
			);
			callback({ message: `Notification sent successfully` });
		} catch (error) {
			console.error("Error occured while sending notification:", error);
			callback({ message: `Error occured while sending notification` });
		}
	}
}
export default new NotificationHandler();
