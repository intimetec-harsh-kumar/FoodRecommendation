import pool from "../config/dbConnection";
import { INotification } from "../models/INotification";
import { FoodItemRepository } from "../repository/foodItemRepository";
import { GenericRepository } from "../repository/genericRepository";
import { NotificationRepository } from "../repository/notificationRepository";
import DateService from "./dateService";
import FoodRecommendationEngineService from "./foodRecommendationService";

class NotificationService {
	async pushNotification(notification: Partial<INotification>): Promise<any> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository(pool, "Notification");
			const rows: any = await genericRepository.add(notification);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}
	async getNotification(notificationTypeId?: number): Promise<any> {
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
					message: JSON.stringify({
						itemId: item[0].id,
						itemName: item[0].item_name,
					}),
					Date: DateService.getCurrentDate(),
				};
				this.pushNotification(notification);
			});
		} catch (error) {
			throw error;
		}
	}
	async sendNotificationForDetailedFeedback(
		foodItemIdForDetailedFeedback: number,
		questions: string
	) {
		try {
			let notification = {
				notification_type_id: 5,
				message: `We are trying to improve your experience with food item having id ${foodItemIdForDetailedFeedback}. Please provide your feedback by 
					answering following questions. ${questions}`,
				Date: DateService.getCurrentDate(),
			};
			this.pushNotification(notification);
		} catch (error) {
			throw error;
		}
	}
}
export default new NotificationService();
