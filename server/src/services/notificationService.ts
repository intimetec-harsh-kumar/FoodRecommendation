import pool from "../config/dbConnection";
import { FoodItemRepository } from "../repository/foodItemRepository";
import { GenericRepository } from "../repository/genericRepository";
import { NotificationRepository } from "../repository/notificationRepository";
import dateService from "./dateService";
import FoodRecommendationEngineService from "./foodRecommendationService";

class NotificationService {
	async pushNotification(notification: any): Promise<void> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository(pool, "Notification");
			const rows: any = await genericRepository.add(notification);
			connection.release();
			return rows;
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
	async getNotification(notificationTypeId?: number): Promise<void> {
		try {
			const connection = await pool.getConnection();
			const notificationRepository = new NotificationRepository(
				pool,
				"Notification"
			);
			const rows: any = await notificationRepository.getCurrentNotification(
				notificationTypeId
			);
			connection.release();
			return rows;
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
	async sendFoodItemNotificationForNextDay(
		foodItemIdsToRollOutForNextDay: string
	) {
		try {
			let genericRepository = new GenericRepository(pool, "Item");
			foodItemIdsToRollOutForNextDay.split(",").forEach(async (itemId) => {
				let item: any = await genericRepository.getById(itemId);
				let notification = {
					notification_type_id: 4,
					message: item[0].item_name,
					Date: dateService.getCurrentDate(),
				};
				this.pushNotification(notification);
			});
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
}
export default new NotificationService();
