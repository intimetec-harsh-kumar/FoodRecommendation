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
					"Chef: Choose an action (\n 1: View Menu Items \n 2: View Meal Types \n 3: View Notifications \n 4: View Available Food Items \n 5: Send Notification for Next Day Meal \n 6: View Recommendations \n 7: View Voted Items \n 8: View Discard Menu List \n 9: Logout \n): "
				)
			);

			switch (action) {
				case 1:
					let menuItems = await this.chefHandlers.viewMenuItems();
					console.table(menuItems);
					break;
				case 2:
					let mealTypes = await this.chefHandlers.viewMealTypes();
					console.table(mealTypes);
					break;
				case 3:
					let notifications = await this.chefHandlers.viewNotifications();
					console.table(notifications);
					break;
				case 4:
					let availableFoodItems =
						await this.chefHandlers.viewAvailableFoodItems();
					console.table(availableFoodItems);
					break;
				case 5:
					let mealTypeId = await InputHandlerService.askQuestion(
						"Please select mealTypeId (1: breakfast,2: lunch, 3:dinner) : "
					);
					let numberOfRecommendations = await InputHandlerService.askQuestion(
						"Please enter number of recommendation you want to get : "
					);
					let recommendedFoodItems =
						await this.chefHandlers.viewRecommendations(
							parseInt(mealTypeId),
							parseInt(numberOfRecommendations)
						);
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
						let message =
							await this.chefHandlers.sendFoodNotificationForNextDay(
								foodItemIdsToRollOutForNextDay
							);
						console.log(message);
					}
					break;
				case 6:
					let mealType = await InputHandlerService.askQuestion(
						"Please select mealTypeId (1: breakfast,2: lunch, 3:dinner) : "
					);
					let numberOfRecommendation = await InputHandlerService.askQuestion(
						"Please enter number of recommendation you want to get : "
					);
					let recommendations: any =
						await this.chefHandlers.viewRecommendations(
							parseInt(mealType),
							parseInt(numberOfRecommendation)
						);
					console.table(recommendations);
					break;
				case 7:
					let votedItems = await this.chefHandlers.viewVotedItems();
					console.table(votedItems);
					break;
				case 8:
					let discardMenuItemList =
						await this.chefHandlers.viewDiscardMenuItemList();
					if (typeof discardMenuItemList === "string") {
						console.table(discardMenuItemList);
					} else {
						console.table(discardMenuItemList);
						const discardMenuItemListAction =
							await InputHandlerService.askQuestion(
								"Choose an action:\n 1: Remove the Food Item from Menu List\n 2: Get Detailed Feedback\n"
							);

						switch (parseInt(discardMenuItemListAction)) {
							case 1:
								let itemIdToDiscard = await InputHandlerService.askQuestion(
									"Enter Item Id to be discarded : "
								);
								let message = await this.chefHandlers.handleDeleteItem(
									parseInt(itemIdToDiscard)
								);
								console.log(message);
								break;
							case 2:
								const itemIdToGetFeedback =
									await InputHandlerService.askQuestion(
										"Enter the food item ID to get detailed feedback: "
									);
								let questions = await InputHandlerService.askQuestion(
									"Enter questions about food item for feedback: "
								);
								let notificationMessage =
									await this.chefHandlers.handleSendNotificationForDetailedFeedback(
										parseInt(itemIdToGetFeedback),
										questions
									);
								console.log(notificationMessage);
								break;
							default:
								console.log("Invalid action. Please try again.");
						}
					}
					break;
				case 9:
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
