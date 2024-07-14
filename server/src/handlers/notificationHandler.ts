import { Socket } from "socket.io";
import { INotification } from "../models/INotification";
import NotificationService from "../services/notificationService";

class NotificationHandler {
	public async handleViewNotifications(
		socket: Socket,
		callback: (response: {
			notification: INotification[];
			error?: string;
		}) => void,
		notificationTypeId?: number
	): Promise<void> {
		try {
			const notification: any = await NotificationService.getNotification(
				socket,
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
