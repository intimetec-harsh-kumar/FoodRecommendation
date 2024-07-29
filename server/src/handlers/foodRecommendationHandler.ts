import { Socket } from "socket.io";
import FoodRecommendationEngineService from "../services/foodRecommendationService";

class FoodRecommendationHandler {
	public async handleViewRecommendation(
		socket: Socket,
		mealType: number,
		numberOfRecommendation: number,
		callback: (response: { recommendations: any; error?: string }) => void
	): Promise<any> {
		try {
			let foodItemRecommendationForNextDay =
				await FoodRecommendationEngineService.getRecommendations(
					mealType,
					numberOfRecommendation
				);
			callback({ recommendations: foodItemRecommendationForNextDay });
		} catch (error: any) {
			console.error("Error fetching recommendations:", error.message);
			callback({
				recommendations: [],
				error: `Error occured: ${error.message}`,
			});
		}
	}

	public async handleViewDiscardMenuItemList(
		socket: Socket,
		callback: (response: { items: any; error?: string }) => void
	): Promise<any> {
		try {
			let discardMenuItemList =
				await FoodRecommendationEngineService.getDiscardMenuItemList();
			callback({ items: discardMenuItemList });
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({
				items: [],
				error: `Error occured: ${error.message}`,
			});
		}
	}
}

export default new FoodRecommendationHandler();
