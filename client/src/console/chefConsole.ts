import InputHandlerService from "../services/inputHandlerService";
import SocketService from "../services/socketService";
import ChefHandlers from "../handlers/chefHandlers";

class ChefConsole {
	private chefHandlers: ChefHandlers;

	constructor(private socketService: SocketService) {
		this.chefHandlers = new ChefHandlers(this.socketService.getSocket());
	}

	async start() {
		let isConsoleRunning = true;
		while (isConsoleRunning) {
			const action = parseInt(
				await InputHandlerService.askQuestion(
					"Chef: Choose an action (\n 1: View Menu Items \n 2: View Meal Types \n 3: View Notifications \n 4: View Available Food Items \n 5: Send Notification \n 6: View Recommendations \n 7: View Voted Items \n 8: Logout \n): "
				)
			);

			switch (action) {
				case 1:
					let menuItems = await this.chefHandlers.viewMenuItems();
					console.log(menuItems);
					break;
				case 2:
					let mealTypes = await this.chefHandlers.viewMealTypes();
					console.log(mealTypes);
					break;
				case 3:
					let notifications = await this.chefHandlers.viewNotifications();
					console.log(notifications);
					break;
				case 4:
					let availableFoodItems =
						await this.chefHandlers.viewAvailableFoodItems();
					console.log(availableFoodItems);
					break;
				case 5:
					let recommendedFoodItems =
						await this.chefHandlers.viewRecommendations();
					const recommendedFoodItemIds = new Set(
						recommendedFoodItems.map((item: any) => item.food_item_id)
					);

					console.log(
						"Choose from recommeded food item IDs : " +
							recommendedFoodItems
								.map((item: any) => item.food_item_id)
								.join(",")
					);
					const foodItemIdsToRollOutForNextDay =
						await InputHandlerService.askQuestion(
							"Enter comma seperated food item id to roll out : "
						);
					const selectedFoodItemIds = foodItemIdsToRollOutForNextDay
						.split(",")
						.map((id) => id.trim());
					const invalidFoodItemIds = selectedFoodItemIds.filter(
						(id) => !recommendedFoodItemIds.has(parseInt(id))
					);
					if (invalidFoodItemIds.length > 0) {
						console.log(
							"Invalid Food Item Ids: " + invalidFoodItemIds.join(",")
						);
						console.log(
							"Please enter valid Food Item Ids from the list: " +
								Array.from(recommendedFoodItemIds).join(",")
						);
					} else {
						let message = await this.chefHandlers.sendFoodNotification(
							foodItemIdsToRollOutForNextDay
						);
						console.log(message);
					}
					break;
				case 6:
					let recommendations: any =
						await this.chefHandlers.viewRecommendations();
					console.log(recommendations);
					break;
				case 7:
					let votedItems = await this.chefHandlers.viewVotedItems();
					console.log(votedItems);
					break;
				case 8:
					await this.chefHandlers.logout();
					isConsoleRunning = false;
					return;
				default:
					console.log("Invalid action. Please try again.");
			}
		}
	}
}

export default ChefConsole;
