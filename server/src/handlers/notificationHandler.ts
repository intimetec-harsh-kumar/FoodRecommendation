import { log } from "console";
import NotificationService from "../services/notificationService";

class NotificationHandler {
	public async handleViewNotifications(
		callback: (response: {
			notification: {
				Id: number;
				NotificationTypeId: number;
				Message: string;
				Date: any;
			}[];
		}) => void,
		notificationTypeId?: number
	): Promise<void> {
		try {
			console.log("in nh", notificationTypeId);
			const notification: any = await NotificationService.getNotification(
				notificationTypeId
			);
			callback({ notification: notification });
		} catch (error) {
			console.error("Error retrieving items:", error);
		}
	}

	public async handleSendNotifications() {
		try {
			await NotificationService.sendFoodItemNotificationForNextDay();
		} catch (error) {
			console.error("Error retrieving items:", error);
		}
	}
}
export default new NotificationHandler();
