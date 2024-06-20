import pool from "../config/dbConnection";
import { FoodItemRepository } from "../repository/foodItemRepository";

class FoodRecommendationEngineService {
	private foodItems: any[];

	constructor(foodItems: any[]) {
		this.foodItems = foodItems;
	}

	public async calculateRecommendationScores(): Promise<void> {
		for (const item of this.foodItems) {
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
	}

	public getRecommendations(limit: number): any[] {
		let foodItemsSortedByRecommendation: any[] = this.foodItems.sort(
			(a, b) => b.recommendationScore - a.recommendationScore
		);
		let topRecommendations = foodItemsSortedByRecommendation.slice(0, limit);
		return topRecommendations;
	}
}
export default FoodRecommendationEngineService;
