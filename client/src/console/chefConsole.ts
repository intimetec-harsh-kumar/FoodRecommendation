import InputHandlerService from "../services/inputHandlerService";
import SocketService from "../services/socketService";
import ChefHandlers from "../handlers/chefHandlers";
import AuthenticationService from "../services/authenticationService";
import { Constants } from "../constants/constant";

class ChefConsole {
	private chefHandlers: ChefHandlers;
	private authenticationService: AuthenticationService;
	constructor(private socketService: SocketService) {
		this.chefHandlers = new ChefHandlers(this.socketService.getSocket());
		this.authenticationService = new AuthenticationService(
			this.socketService.getSocket()
		);
	}

	async start() {
		let isConsoleRunning = true;
		while (isConsoleRunning) {
			const action = parseInt(
				await InputHandlerService.askQuestion(
					`Chef: Choose an action (\n 1: ${Constants.ViewItem} \n 2: ${Constants.ViewMealType} \n 3: ${Constants.ViewNotification} \n 4: ${Constants.ViewAvailableItems} \n 5: ${Constants.SendNotification} \n 6: ${Constants.ViewRecommendation} \n 7: ${Constants.ViewVotedItems} \n 8: ${Constants.ViewDiscardedItem} \n 9: ${Constants.PrepareFood} \n 10: ${Constants.Logout} \n): `
				)
			);

			switch (action) {
				case 1:
					let menuItems = await this.chefHandlers.viewMenuItems();
					if (menuItems.length === 0) {
						console.log(Constants.Logout);
					} else {
						console.table(menuItems);
					}
					break;
				case 2:
					let mealTypes = await this.chefHandlers.viewMealTypes();
					if (mealTypes.length === 0) {
						console.log(Constants.NoRecordFound);
					} else {
						console.table(mealTypes);
					}
					break;
				case 3:
					let notifications = await this.chefHandlers.viewNotifications();
					if (notifications.length === 0) {
						console.log(Constants.NoRecordFound);
					} else {
						console.table(notifications);
					}
					break;
				case 4:
					let availableFoodItems =
						await this.chefHandlers.viewAvailableFoodItems();
					if (availableFoodItems.length === 0) {
						console.log(Constants.NoRecordFound);
					} else {
						console.table(availableFoodItems);
					}
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
					if (recommendedFoodItems.length === 0) {
						console.log("There is no food recommendation");
						break;
					}
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
					if (votedItems.length === 0) {
						console.log(Constants.NoRecordFound);
					} else {
						console.table(votedItems);
					}
					break;
				case 8:
					let discardMenuItemList =
						await this.chefHandlers.viewDiscardMenuItemList();
					if (discardMenuItemList.length === 0) {
						console.log("Currently there are no food to discard");
						break;
					}
					console.table(discardMenuItemList);
					const discardMenuItemListAction =
						await InputHandlerService.askQuestion(
							`Choose an action:\n 1: ${Constants.RemoveItem}\n 2: ${Constants.DetailedFeedback}\n`
						);
					const discardMenuItemListIds = new Set(
						discardMenuItemList.map((item: any) => item.food_item_id)
					);
					switch (parseInt(discardMenuItemListAction)) {
						case 1:
							let itemIdToDiscard = await InputHandlerService.askQuestion(
								"Enter Item Id to be discarded : "
							);
							if (discardMenuItemListIds.has(itemIdToDiscard)) {
								let message = await this.chefHandlers.handleDeleteItem(
									parseInt(itemIdToDiscard)
								);
								console.log(message);
							} else {
								console.log(
									"Please choose from the discard menu item list only."
								);
							}
							break;
						case 2:
							const itemIdToGetFeedback = await InputHandlerService.askQuestion(
								"Enter the food item ID to get detailed feedback: "
							);
							if (discardMenuItemListIds.has(parseInt(itemIdToGetFeedback))) {
								let questions = await InputHandlerService.askQuestion(
									"Enter questions about food item for feedback: "
								);
								let notificationMessage =
									await this.chefHandlers.handleSendNotificationForDetailedFeedback(
										parseInt(itemIdToGetFeedback),
										questions
									);
								console.log(notificationMessage);
							} else {
								console.log(
									"Please choose from the discard menu item list only."
								);
							}
							break;
						default:
							console.log(Constants.InValidAction);
					}
					break;
				case 9:
					let votedItem = await this.chefHandlers.viewVotedItems();
					let votedItemIds = new Set(
						votedItem.map((item: any) => item.food_item_id)
					);
					console.log(votedItemIds);

					let foodItemId = await InputHandlerService.askQuestion(
						"Enter fooditem id you want to prepare today : "
					);
					if (!votedItemIds.has(parseInt(foodItemId))) {
						console.log("Invalid foodiItemId choosen");
						break;
					}
					let message = await this.chefHandlers.prepareFood(
						parseInt(foodItemId)
					);
					console.log(message);
					break;
				case 10:
					let logoutMessage = await this.chefHandlers.logout();
					console.log(logoutMessage);
					await this.authenticationService.authenticate();
					isConsoleRunning = false;
					break;
				default:
					console.log(Constants.InValidAction);
			}
		}
	}
}

export default ChefConsole;
