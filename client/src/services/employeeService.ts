import EmployeeHandlers from "../handlers/employeeHandlers";
import InputHandlerService from "../services/inputHandlerService";
import { Constants } from "../constants/constant";
import ConsoleService from "./consoleService";

class EmployeeService {
	private employeeHandlers: EmployeeHandlers;

	constructor(employeeHandlers: EmployeeHandlers) {
		this.employeeHandlers = employeeHandlers;
	}

	async handleViewItems() {
		let menuItems = await this.employeeHandlers.viewMenuItems();
		if (menuItems.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(menuItems);
		}
	}

	async handleViewTodaysMenu() {
		let notifications = await this.employeeHandlers.viewNotifications(
			Constants.NotificationIdForTodaysPreparedFood
		);
		if (notifications.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			notifications.forEach((notification) =>
				ConsoleService.displayMessage(
					JSON.parse(JSON.stringify(notification.message)).itemName
				)
			);
		}
	}

	async handleSendFeedback() {
		let foodItems = await this.employeeHandlers.viewMenuItems();
		const foodItemIds = new Set(foodItems.map((item: any) => item.id));
		const food_item_id = await InputHandlerService.askQuestion(
			"Enter item Id: "
		);
		if (!foodItemIds.has(parseInt(food_item_id))) {
			ConsoleService.displayMessage("Please enter a valid foodItem Id");
			return;
		}
		const rating = await InputHandlerService.askQuestion(
			"Enter your rating (0-5): "
		);
		if (parseInt(rating) < 0 || parseInt(rating) > 5) {
			ConsoleService.displayMessage(
				"Please enter the rating in the range 0-5 only."
			);
			return;
		}
		const comment = await InputHandlerService.askQuestion(
			"Enter your feedback: "
		);
		let feedbackMessage = await this.employeeHandlers.provideFeedback(
			food_item_id,
			rating,
			comment
		);
		ConsoleService.displayMessage(feedbackMessage);
	}

	async handleChooseNextDayFood() {
		let rolledOutFoodItems: any = await this.employeeHandlers.viewNotifications(
			Constants.NotificationIdForFoodRecommendation
		);
		if (rolledOutFoodItems.length == 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(
				rolledOutFoodItems.map((item: any) => {
					const messageObj = JSON.parse(item.message);
					return {
						itemId: messageObj.itemId,
						itemName: messageObj.itemName,
					};
				})
			);
			let rolledOutFoodItemsId = rolledOutFoodItems
				.map((item: any) => JSON.parse(item.message).itemId)
				.join(",");
			ConsoleService.displayMessage(
				"Rolled Out Food Item Ids : " + rolledOutFoodItemsId
			);
			const selectedFoodItemIds = await InputHandlerService.askQuestion(
				"Enter item Id to select for next day separated by comma: "
			);
			const invalidFoodItemIds: string[] = [];
			selectedFoodItemIds.split(",").forEach((id) => {
				if (!rolledOutFoodItemsId.split(",").includes(id)) {
					invalidFoodItemIds.push(id);
				}
			});
			if (invalidFoodItemIds.length > 0) {
				ConsoleService.displayMessage(
					"Invalid Food Item Ids: " +
						invalidFoodItemIds.join(",") +
						"\n" +
						"Please enter valid Food Item Ids from: " +
						rolledOutFoodItemsId
				);
			} else {
				await this.employeeHandlers.selectFoodItemForNextDay(
					selectedFoodItemIds
				);
			}
		}
	}

	async handleUpdateProfile() {
		const validSpiceLevels = ["low", "medium", "high"];
		const validFoodTypes = ["vegetarian", "non vegetarian"];
		const validOriginality = ["north indian", "south indian", "others"];
		const food_type = await InputHandlerService.askQuestion(
			"Enter food type (vegetarian,non vegetarian): "
		);
		if (!validFoodTypes.includes(food_type)) {
			ConsoleService.displayMessage("Invalid selection");
			return;
		}
		const spice_level = await InputHandlerService.askQuestion(
			"Enter spice level (low,medium,high): "
		);
		if (!validSpiceLevels.includes(spice_level)) {
			ConsoleService.displayMessage("Invalid selection");
			return;
		}
		const originality = await InputHandlerService.askQuestion(
			"Enter from where the food belongs (north indian,south indian,others): "
		);
		if (!validOriginality.includes(originality)) {
			ConsoleService.displayMessage("Invalid selection");
			return;
		}
		const sweet_tooth =
			(await InputHandlerService.askQuestion(
				"Enter if you have sweet tooth (yes/no): "
			)) === "yes";
		let message = await this.employeeHandlers.updateProfile({
			food_type,
			spice_level,
			originality,
			sweet_tooth,
		});
		ConsoleService.displayMessage(message);
	}

	async handleLogout() {
		let logoutMessage = await this.employeeHandlers.logout();
		ConsoleService.displayMessage(logoutMessage);
	}
}

export default EmployeeService;
