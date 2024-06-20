import { Socket } from "socket.io";
import FoodRecommendationEngineService from "../services/foodRecommendationService";
import { FoodItemRepository } from "../repository/foodItemRepository";
import pool from "../config/dbConnection";

class FoodRecommendationHandler {
	public async handleViewRecommendation(
		socket: Socket,
		callback: (response: { recommendations: any[] }) => void
	): Promise<any> {
		try {
			const foodItemRepo = new FoodItemRepository(pool, "items");
			const rows: any = await foodItemRepo.getItemsForRecommendation();
			const foodItems: any[] = rows;
			const recommendationEngine = new FoodRecommendationEngineService(
				foodItems
			);

			recommendationEngine.calculateRecommendationScores();
			const recommendations = recommendationEngine.getRecommendations(5);
			callback({ recommendations: recommendations });
			console.log("Recommended Food Items:", recommendations);
		} catch (error) {
			console.error("Error fetching recommendations:", error);
		}
	}
}

export default new FoodRecommendationHandler();
