import ChefHandlers from "../handlers/chefHandlers";
import InputHandlerService from "../services/inputHandlerService";
import { Constants } from "../constants/constant";
import AuthenticationService from "./authenticationService";
import ConsoleService from "./consoleService";

class ChefService {
	private chefHandlers: ChefHandlers;
	private authenticationService: AuthenticationService;
	constructor(
		chefHandlers: ChefHandlers,
		authenticationService: AuthenticationService
	) {
		this.chefHandlers = chefHandlers;
		this.authenticationService = authenticationService;
	}

	async handleViewItems() {
		let menuItems = await this.chefHandlers.viewMenuItems();
		if (menuItems.length === 0) {
			ConsoleService.displayMessage(Constants.Logout);
		} else {
			ConsoleService.displayTable(menuItems);
		}
	}

	async handleViewMealTypes() {
		let mealTypes = await this.chefHandlers.viewMealTypes();
		if (mealTypes.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(mealTypes);
		}
	}

	async handleViewNotifications() {
		let notifications = await this.chefHandlers.viewNotifications();
		if (notifications.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(notifications);
		}
	}

	async handleViewAvailableItems() {
		let availableFoodItems = await this.chefHandlers.viewAvailableFoodItems();
		if (availableFoodItems.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(availableFoodItems);
		}
	}

	async handleSendNotification() {
		let mealTypeId = parseInt(
			await InputHandlerService.askQuestion(
				"Please select mealTypeId (1: breakfast,2: lunch, 3:dinner) : "
			)
		);
		if (!Constants.validMealTypeIds.has(mealTypeId)) {
			ConsoleService.displayMessage("Please enter valid meal type id");
			return;
		}
		let numberOfRecommendations = parseInt(
			await InputHandlerService.askQuestion(
				"Please enter number of recommendations you want to get : "
			)
		);
		let recommendedFoodItems = await this.chefHandlers.viewRecommendations(
			mealTypeId,
			numberOfRecommendations
		);
		if (recommendedFoodItems.length === 0) {
			ConsoleService.displayMessage("There is no food recommendation");
			return;
		}
		const recommendedFoodItemIds = new Set(
			recommendedFoodItems.map((item: any) => item.food_item_id)
		);

		ConsoleService.displayMessage(
			"Choose from recommended food item IDs : " +
				recommendedFoodItems.map((item: any) => item.food_item_id).join(",")
		);
		const foodItemIdsToRollOutForNextDay =
			await InputHandlerService.askQuestion(
				"Enter comma-separated food item id to roll out : "
			);
		const selectedFoodItemIds = foodItemIdsToRollOutForNextDay
			.split(",")
			.map((id) => id.trim());
		const invalidFoodItemIds = selectedFoodItemIds.filter(
			(id) => !recommendedFoodItemIds.has(parseInt(id))
		);
		if (invalidFoodItemIds.length > 0) {
			ConsoleService.displayMessage(
				"Invalid Food Item Ids: " + invalidFoodItemIds.join(",")
			);
			ConsoleService.displayMessage(
				"Please enter valid Food Item Ids from the list: " +
					Array.from(recommendedFoodItemIds).join(",")
			);
		} else {
			let message = await this.chefHandlers.sendFoodNotificationForNextDay(
				foodItemIdsToRollOutForNextDay
			);
			ConsoleService.displayMessage(message);
		}
	}

	async handleViewRecommendation() {
		let mealType = parseInt(
			await InputHandlerService.askQuestion(
				"Please select mealTypeId (1: breakfast,2: lunch, 3:dinner) : "
			)
		);
		if (!Constants.validMealTypeIds.has(mealType)) {
			ConsoleService.displayMessage("Invalid meal type id");
			return;
		}
		let numberOfRecommendation = parseInt(
			await InputHandlerService.askQuestion(
				"Please enter number of recommendation you want to get : "
			)
		);
		let recommendations: any = await this.chefHandlers.viewRecommendations(
			mealType,
			numberOfRecommendation
		);
		ConsoleService.displayTable(recommendations);
	}

	async handleViewVotedItems() {
		let votedItems = await this.chefHandlers.viewVotedItems();
		if (votedItems.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(votedItems);
		}
	}

	async handleViewDiscardedItems() {
		let discardMenuItemList = await this.chefHandlers.viewDiscardMenuItemList();
		if (discardMenuItemList.length === 0) {
			ConsoleService.displayMessage("Currently there are no food to discard");
			return;
		}
		ConsoleService.displayTable(discardMenuItemList);
		const discardMenuItemListAction = await InputHandlerService.askQuestion(
			`Choose an action:\n 1: ${Constants.RemoveItem}\n 2: ${Constants.DetailedFeedback}\n`
		);
		const discardMenuItemListIds = new Set(
			discardMenuItemList.map((item: any) => item.food_item_id)
		);
		switch (parseInt(discardMenuItemListAction)) {
			case 1:
				let itemIdToDiscard = parseInt(
					await InputHandlerService.askQuestion(
						"Enter Item Id to be discarded : "
					)
				);
				if (discardMenuItemListIds.has(itemIdToDiscard)) {
					let message = await this.chefHandlers.handleDeleteItem(
						itemIdToDiscard
					);
					ConsoleService.displayMessage(message);
				} else {
					ConsoleService.displayMessage(
						"Please choose from the discard menu item list only."
					);
				}
				break;
			case 2:
				const itemIdToGetFeedback = parseInt(
					await InputHandlerService.askQuestion(
						"Enter the food item ID to get detailed feedback: "
					)
				);
				if (discardMenuItemListIds.has(itemIdToGetFeedback)) {
					let questions = await InputHandlerService.askQuestion(
						"Enter questions about food item for feedback: "
					);
					let notificationMessage =
						await this.chefHandlers.handleSendNotificationForDetailedFeedback(
							itemIdToGetFeedback,
							questions
						);
					ConsoleService.displayMessage(notificationMessage);
				} else {
					ConsoleService.displayMessage(
						"Please choose from the discard menu item list only."
					);
				}
				break;
			default:
				ConsoleService.displayMessage(Constants.InValidAction);
		}
	}

	async handlePrepareFood() {
		let votedItem = await this.chefHandlers.viewVotedItems();
		let votedItemIds = new Set(votedItem.map((item: any) => item.food_item_id));

		let foodItemId = parseInt(
			await InputHandlerService.askQuestion(
				"Enter food item id you want to prepare today : "
			)
		);
		if (!votedItemIds.has(foodItemId)) {
			ConsoleService.displayMessage("Invalid food item ID chosen");
			return;
		}
		let message = await this.chefHandlers.prepareFood(foodItemId);
		ConsoleService.displayMessage(message);
	}

	async handleLogout() {
		let logoutMessage = await this.chefHandlers.logout();
		ConsoleService.displayMessage(logoutMessage);
		await this.authenticationService.authenticate();
	}
}

export default ChefService;
