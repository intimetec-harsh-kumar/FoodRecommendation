import pool from "../config/dbConnection";
import { FoodItemRepository } from "../repository/foodItemRepository";

class FoodRecommendationEngineService {
	public calculateRecommendationScores(foodItems: any[]): any {
		for (const item of foodItems) {
			const sentimentScore = item.sentiment;
			const ratingScore = item.rating;
			const voteScore = item.vote;
			const preparationScore = item.noOfTimesPrepared;
			const preparationToRatingRatioScore = item.preparationToRatingRatio;

			item.recommendationScore =
				parseInt(sentimentScore) +
				parseInt(ratingScore) +
				parseInt(voteScore) +
				parseInt(preparationScore) +
				parseInt(preparationToRatingRatioScore) / 5;
		}
		return foodItems;
	}

	public async getRecommendations(limit: number): Promise<any> {
		const foodItemRepo = new FoodItemRepository(pool, "items");
		const foodItems: any = await foodItemRepo.getItemsForRecommendation();
		let foodItemsForRecommendation =
			this.calculateRecommendationScores(foodItems);
		let foodItemsSortedByRecommendation: any[] =
			foodItemsForRecommendation.sort(
				(a: any, b: any) => b.recommendationScore - a.recommendationScore
			);
		let topRecommendations = foodItemsSortedByRecommendation.slice(0, limit);
		return topRecommendations;
	}
}
export default new FoodRecommendationEngineService();
