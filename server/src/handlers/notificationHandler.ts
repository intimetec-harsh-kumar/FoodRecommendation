import { INotification } from "../models/INotification";
import DateService from "../services/dateService";
import NotificationService from "../services/notificationService";

class NotificationHandler {
	public async handleViewNotifications(
		callback: (response: {
			notification: INotification[];
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

	public async handleSendNotificationsForNextDay(
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

	public async handleSendNotificationForDetailedFeedback(
		foodItemIdForDetailedFeedback: any,
		questions: string,
		callback: (response: { message: string; error?: string }) => void
	) {
		try {
			NotificationService.sendNotificationForDetailedFeedback(
				foodItemIdForDetailedFeedback,
				questions
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
