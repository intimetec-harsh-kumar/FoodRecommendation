import pool from "../config/dbConnection";
import { FoodItemRepository } from "../repository/foodItemRepository";

class FoodRecommendationEngineService {
	public calculateRecommendationScores(foodItems: any[]): any {
		try {
			for (const item of foodItems) {
				const sentimentScore = item.sentiment;
				const ratingScore = item.rating;
				const voteScore = item.vote;
				const preparationScore = item.no_of_times_prepared;
				const preparationToRatingRatioScore = item.preparationToRatingRatio;

				item.recommendationScore =
					parseInt(sentimentScore) +
					parseInt(ratingScore) +
					parseInt(voteScore) +
					parseInt(preparationScore) +
					parseInt(preparationToRatingRatioScore) / 5;
			}
			return foodItems;
		} catch (error) {
			throw error;
		}
	}

	public async getRecommendations(limit: number): Promise<any> {
		try {
			const foodItemRepo = new FoodItemRepository(pool, "Item");
			const foodItems: any = await foodItemRepo.getItemsForRecommendation();
			let foodItemsForRecommendation =
				this.calculateRecommendationScores(foodItems);
			let foodItemsSortedByRecommendation: any[] =
				foodItemsForRecommendation.sort(
					(a: any, b: any) => b.recommendationScore - a.recommendationScore
				);
			let topRecommendations = foodItemsSortedByRecommendation.slice(0, limit);
			return topRecommendations;
		} catch (error) {
			throw error;
		}
	}

	public async getDiscardMenuItemList(): Promise<any> {
		try {
			const foodItemRepo = new FoodItemRepository(pool, "Item");
			const foodItemsToBeDiscarded: any =
				await foodItemRepo.getDiscardMenuItemList();
			return foodItemsToBeDiscarded;
		} catch (error) {
			throw error;
		}
	}
}
export default new FoodRecommendationEngineService();
