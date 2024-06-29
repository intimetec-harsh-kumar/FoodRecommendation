import { Socket } from "socket.io";
import FoodRecommendationEngineService from "../services/foodRecommendationService";
import { FoodItemRepository } from "../repository/foodItemRepository";
import pool from "../config/dbConnection";

class FoodRecommendationHandler {
	public async handleViewRecommendation(
		socket: Socket,
		callback: (response: { recommendations: any; error?: string }) => void
	): Promise<any> {
		try {
			let foodItemRecommendationForNextDay =
				await FoodRecommendationEngineService.getRecommendations(5);
			callback({ recommendations: foodItemRecommendationForNextDay });
		} catch (error: any) {
			console.error("Error fetching recommendations:", error.message);
			callback({
				recommendations: [],
				error: `Error occured: ${error.message}`,
			});
		}
	}
}

export default new FoodRecommendationHandler();
