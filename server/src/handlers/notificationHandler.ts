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
			error?: string;
		}) => void,
		notificationTypeId?: number
	): Promise<void> {
		try {
			const notification: any = await NotificationService.getNotification(
				notificationTypeId
			);
			callback({ notification: notification });
		} catch (error: any) {
			console.error("Error occured", error.message);
			callback({ notification: [], error: `Error occured: ${error.message}` });
		}
	}

	public async handleSendNotifications(
		foodItemIdsToRollOutForNextDay: any,
		callback: (response: { message: string; error?: string }) => void
	) {
		try {
			await NotificationService.sendFoodItemNotificationForNextDay(
				foodItemIdsToRollOutForNextDay
			);
			callback({ message: `Notification sent successfully` });
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({
				message: `Error occured while sending notification`,
				error: `Error occured: ${error.message}`,
			});
		}
	}
}
export default new NotificationHandler();
