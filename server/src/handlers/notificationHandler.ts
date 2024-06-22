import { Socket } from "socket.io";
import NotificationService from "../services/notificationService";
import FoodRecommendationEngineService from "../services/foodRecommendationService";

class NotificationHandler {
	public async handleViewNotifications(
		callback: (response: {
			notification: {
				Id: number;
				NotificationTypeId: number;
				Message: string;
				Date: any;
			}[];
		}) => void
	): Promise<void> {
		try {
			const notification: any = await NotificationService.getNotification();
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
