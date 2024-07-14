import AdminHandlers from "../handlers/adminHandlers";
import ConsoleService from "./consoleService";
import InputHandlerService from "./inputHandlerService";
import { Constants } from "../constants/constant";
import { IFoodItem } from "../models/IFoodItem";

class AdminService {
	private adminHandlers: AdminHandlers;

	constructor(adminHandlers: AdminHandlers) {
		this.adminHandlers = adminHandlers;
	}

	async addItem() {
		const item_name = await InputHandlerService.askQuestion(
			"Enter item name: "
		);
		const price = parseFloat(
			await InputHandlerService.askQuestion("Enter item price: ")
		);
		const availability_status =
			(await InputHandlerService.askQuestion(
				"Is the item available? (yes/no): "
			)) === "yes";
		const meal_type_id = parseInt(
			await InputHandlerService.askQuestion(
				"Enter meal type ID (1: breakfast, 2: lunch, 3: dinner): "
			)
		);
		const food_type = await InputHandlerService.askQuestion(
			"Enter food type (vegetarian, non vegetarian): "
		);
		if (!Constants.validFoodTypes.includes(food_type)) {
			ConsoleService.displayMessage("Invalid selection");
			return;
		}
		const spice_level = await InputHandlerService.askQuestion(
			"Enter spice level (low, medium, high): "
		);
		if (!Constants.validSpiceLevels.includes(spice_level)) {
			ConsoleService.displayMessage("Invalid selection");
			return;
		}
		const originality = await InputHandlerService.askQuestion(
			"Enter where the food belongs (north indian, south indian, others): "
		);
		if (!Constants.validOriginality.includes(originality)) {
			ConsoleService.displayMessage("Invalid selection");
			return;
		}
		const is_sweet =
			(await InputHandlerService.askQuestion(
				"Is this item in sweet category (yes/no): "
			)) === "yes";
		const addedItemMessage = await this.adminHandlers.handleAddItem({
			item_name,
			price,
			availability_status,
			meal_type_id,
			food_type,
			spice_level,
			originality,
			is_sweet,
		});
		ConsoleService.displayTable(addedItemMessage);
	}

	async updateItem() {
		const existingItems = await this.adminHandlers.viewItems();
		const existingItemsIds = new Set(
			existingItems.map((item: IFoodItem) => item.id)
		);
		const id = parseInt(
			await InputHandlerService.askQuestion("Enter item ID to update: ")
		);
		if (!existingItemsIds.has(id)) {
			ConsoleService.displayMessage("Please enter correct item Id");
			return;
		}
		const item_name = await InputHandlerService.askQuestion(
			"Enter new item name: "
		);
		const price = parseFloat(
			await InputHandlerService.askQuestion("Enter new item price: ")
		);
		if (isNaN(price)) {
			ConsoleService.displayMessage("Price can not be other than number type");
			return;
		}
		const availability_status =
			(await InputHandlerService.askQuestion(
				"Is the item available? (yes/no): "
			)) === "yes";
		const existingMealTypes = await this.adminHandlers.viewMealTypes();
		const existingMealTypesIds = new Set(
			existingMealTypes.map((mealType: any) => mealType.id)
		);
		const meal_type_id = parseInt(
			await InputHandlerService.askQuestion("Enter new meal type ID: ")
		);
		if (!existingMealTypesIds.has(meal_type_id)) {
			ConsoleService.displayMessage("Please enter correct mealType Id");
			return;
		}
		const food_type = await InputHandlerService.askQuestion(
			"Enter food type (vegetarian, non vegetarian): "
		);
		if (!Constants.validFoodTypes.includes(food_type)) {
			ConsoleService.displayMessage("Invalid selection");
			return;
		}
		const spice_level = await InputHandlerService.askQuestion(
			"Enter spice level (low, medium, high): "
		);
		if (!Constants.validSpiceLevels.includes(spice_level)) {
			ConsoleService.displayMessage("Invalid selection");
			return;
		}
		const originality = await InputHandlerService.askQuestion(
			"Enter where the food belongs (north indian, south indian, others): "
		);
		if (!Constants.validOriginality.includes(originality)) {
			ConsoleService.displayMessage("Invalid selection");
			return;
		}
		const is_sweet =
			(await InputHandlerService.askQuestion(
				"Is this item in sweet category (yes/no): "
			)) === "yes";
		const updatedItemMessage = await this.adminHandlers.handleUpdateItem({
			id,
			item_name,
			price,
			availability_status,
			meal_type_id,
			food_type,
			spice_level,
			originality,
			is_sweet,
		});
		ConsoleService.displayTable(updatedItemMessage);
	}

	async deleteItem() {
		const existingItems = await this.adminHandlers.viewItems();
		const existingItemsIds = new Set(
			existingItems.map((item: IFoodItem) => item.id)
		);
		const id = parseInt(
			await InputHandlerService.askQuestion("Enter item ID to delete: ")
		);
		if (!existingItemsIds.has(id)) {
			ConsoleService.displayMessage("Please enter correct item Id");
			return;
		}
		const deletedItemMessage = await this.adminHandlers.handleDeleteItem(id);
		ConsoleService.displayTable(deletedItemMessage);
	}

	async viewItems() {
		const items = await this.adminHandlers.viewItems();
		if (items.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(items);
		}
	}

	async viewMealTypes() {
		const mealTypes = await this.adminHandlers.viewMealTypes();
		if (mealTypes.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(mealTypes);
		}
	}

	async viewDiscardedItems() {
		const discardMenuItemList =
			await this.adminHandlers.viewDiscardMenuItemList();
		if (discardMenuItemList.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(discardMenuItemList);
			const discardMenuItemListAction = await InputHandlerService.askQuestion(
				`Choose an action:\n 1: ${Constants.RemoveItem}\n 2: ${Constants.DetailedFeedback}\n`
			);

			const discardMenuItemListIds = new Set(
				discardMenuItemList.map((item: any) => item.food_item_id)
			);
			console.log(discardMenuItemListIds);

			switch (parseInt(discardMenuItemListAction)) {
				case 1:
					const itemIdToDiscard = parseInt(
						await InputHandlerService.askQuestion(
							"Enter Item Id to be discarded : "
						)
					);
					if (discardMenuItemListIds.has(itemIdToDiscard)) {
						const message = await this.adminHandlers.handleDeleteItem(
							itemIdToDiscard
						);
						ConsoleService.displayMessage(message);
					}
					break;
				case 2:
					const itemIdToGetFeedback = parseInt(
						await InputHandlerService.askQuestion(
							"Enter the food item ID to get detailed feedback: "
						)
					);
					if (!discardMenuItemListIds.has(itemIdToGetFeedback)) {
						ConsoleService.displayMessage("Please enter valid item id");
						break;
					}
					const questions = await InputHandlerService.askQuestion(
						"Enter questions about food item for feedback: "
					);
					const notificationMessage =
						await this.adminHandlers.handleSendNotificationForDetailedFeedback(
							itemIdToGetFeedback,
							questions
						);
					ConsoleService.displayMessage(notificationMessage);
					break;
				default:
					ConsoleService.displayMessage(Constants.InValidAction);
			}
		}
	}

	async viewLogs() {
		const logs = await this.adminHandlers.viewLog();
		if (logs.length === 0) {
			ConsoleService.displayMessage(Constants.NoRecordFound);
		} else {
			ConsoleService.displayTable(logs);
		}
	}

	async logout() {
		const logoutMessage = await this.adminHandlers.logout();
		ConsoleService.displayMessage(logoutMessage);
	}
}

export default AdminService;
