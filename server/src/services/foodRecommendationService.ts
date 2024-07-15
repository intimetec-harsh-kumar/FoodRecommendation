import pool from "../config/dbConnection";
import { FoodItemRepository } from "../repository/foodItemRepository";

class FoodRecommendationEngineService {
	public calculateRecommendationScores(foodItems: any[]): any {
		try {
			for (const item of foodItems) {
				const sentimentScore = parseInt(item.sentiment);
				const ratingScore = parseInt(item.rating);
				const voteScore = parseInt(item.vote);
				const preparationScore = parseInt(item.no_of_times_prepared);
				const preparationToRatingRatioScore = parseInt(
					item.preparationToRatingRatio
				);

				item.recommendationScore =
					sentimentScore +
					ratingScore +
					voteScore +
					preparationScore +
					preparationToRatingRatioScore / 5;
			}
			return foodItems;
		} catch (error) {
			throw error;
		}
	}
	private async fetchFoodItemsForRecommendation(
		mealType: number
	): Promise<any> {
		const foodItemRepository = new FoodItemRepository(pool, "Item");
		return await foodItemRepository.getItemsForRecommendation(mealType);
	}
	private sortFoodItemsByRecommendation(foodItems: any[]): any[] {
		return foodItems.sort(
			(a: any, b: any) => b.recommendationScore - a.recommendationScore
		);
	}
	public async getRecommendations(
		mealType: number,
		limit: number
	): Promise<any> {
		try {
			const foodItems = await this.fetchFoodItemsForRecommendation(mealType);
			let foodItemsForRecommendation =
				this.calculateRecommendationScores(foodItems);
			const foodItemsSortedByRecommendation =
				this.sortFoodItemsByRecommendation(foodItemsForRecommendation);
			return foodItemsSortedByRecommendation.slice(0, limit);
		} catch (error) {
			throw error;
		}
	}

	public async getDiscardMenuItemList(): Promise<any> {
		try {
			const foodItemRepository = new FoodItemRepository(pool, "Item");
			const foodItemsToBeDiscarded: any =
				await foodItemRepository.getDiscardMenuItemList();
			return foodItemsToBeDiscarded;
		} catch (error) {
			throw error;
		}
	}
}
export default new FoodRecommendationEngineService();
