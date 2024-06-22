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
			const genericRepository = new GenericRepository(pool, "Notifications");
			const rows: any = await genericRepository.add(notification);
			connection.release();
			return rows;
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
	async getNotification(): Promise<void> {
		try {
			const connection = await pool.getConnection();
			const notificationRepository = new NotificationRepository(
				pool,
				"Notifications"
			);
			const rows: any = await notificationRepository.getCurrentNotification();
			console.log("in ns", rows);

			connection.release();
			return rows;
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
	async sendFoodItemNotificationForNextDay() {
		try {
			const foodItemRepo = new FoodItemRepository(pool, "items");
			const foodItems: any = await foodItemRepo.getItemsForRecommendation();
			const recommendationEngine = new FoodRecommendationEngineService(
				foodItems
			);
			recommendationEngine.calculateRecommendationScores();
			const recommendations = recommendationEngine.getRecommendations(5);
			recommendations.forEach((recommendation) => {
				let notification = {
					NotificationTypeId: 1,
					Message: recommendation.foodItemId,
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
