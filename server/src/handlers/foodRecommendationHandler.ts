import { Socket } from "socket.io";
import FoodRecommendationEngineService from "../services/foodRecommendationService";
import { FoodItemRepository } from "../repository/foodItemRepository";
import pool from "../config/dbConnection";

class FoodRecommendationHandler {
	public async handleViewRecommendation(
		socket: Socket,
		callback: (response: { recommendations: any }) => void
	): Promise<any> {
		try {
			let foodItemRecommendationForNextDay =
				await FoodRecommendationEngineService.getRecommendations(5);
			callback({ recommendations: foodItemRecommendationForNextDay });
			console.log("Recommended Food Items:", foodItemRecommendationForNextDay);
		} catch (error) {
			console.error("Error fetching recommendations:", error);
		}
	}
}

export default new FoodRecommendationHandler();
