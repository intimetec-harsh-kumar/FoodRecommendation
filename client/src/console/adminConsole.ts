import InputHandlerService from "../services/inputHandlerService";
import SocketService from "../services/socketService";
import AdminHandlers from "../handlers/adminHandlers";
import AuthenticationService from "../services/authenticationService";

class AdminConsole {
	private adminHandlers: AdminHandlers;
	private authenticationService: AuthenticationService;

	constructor(private socketService: SocketService) {
		this.adminHandlers = new AdminHandlers(this.socketService.getSocket());
		this.authenticationService = new AuthenticationService(
			this.socketService.getSocket()
		);
	}

	async start() {
		let isConsoleRunning = true;
		var existingItems = await this.adminHandlers.viewItems();
		let existingItemsIds = new Set(existingItems.map((item: any) => item.id));
		while (isConsoleRunning) {
			const action = await InputHandlerService.askQuestion(
				"Admin: Choose an action (\n 1: Add an Item\n 2: Update an Item \n 3: Delete an Item \n 4: View Items \n 5: View Meal Types \n 6: View Discard MenuItem List \n 7: View Logs \n 8: Logout\n): "
			);
			switch (action) {
				case "1":
					var item_name = await InputHandlerService.askQuestion(
						"Enter item name: "
					);
					var price = parseFloat(
						await InputHandlerService.askQuestion("Enter item price: ")
					);
					var availability_status =
						(await InputHandlerService.askQuestion(
							"Is the item available? (yes/no): "
						)) === "yes";
					var meal_type_id = parseInt(
						await InputHandlerService.askQuestion(
							"Enter meal type ID (1: breakfast, 2: lunch, 3: dinner): "
						)
					);
					let addedItemMessage = await this.adminHandlers.handleAddItem(
						item_name,
						price,
						availability_status,
						meal_type_id
					);
					console.table(addedItemMessage);
					break;
				case "2":
					var id = parseInt(
						await InputHandlerService.askQuestion("Enter item ID to update: ")
					);
					if (!existingItemsIds.has(id)) {
						console.log("Please enter correct item Id");
						break;
					}
					var item_name = await InputHandlerService.askQuestion(
						"Enter new item name: "
					);
					var price = parseFloat(
						await InputHandlerService.askQuestion("Enter new item price: ")
					);
					if (isNaN(price)) {
						console.log("Price can not be other than number type");
						break;
					}
					var availability_status =
						(await InputHandlerService.askQuestion(
							"Is the item available? (yes/no): "
						)) === "yes";
					var existingMealTypes = await this.adminHandlers.viewMealTypes();
					let existingMealTypesIds = new Set(
						existingMealTypes.map((mealType: any) => mealType.id)
					);
					var meal_type_id = parseInt(
						await InputHandlerService.askQuestion("Enter new meal type ID: ")
					);
					if (!existingMealTypesIds.has(meal_type_id)) {
						console.log("Please enter correct mealType Id");
						return;
					}
					let updatedItemMessage = await this.adminHandlers.handleUpdateItem(
						id,
						item_name,
						price,
						availability_status,
						meal_type_id
					);
					console.table(updatedItemMessage);
					break;
				case "3":
					var id = parseInt(
						await InputHandlerService.askQuestion("Enter item ID to delete: ")
					);
					if (!existingItemsIds.has(id)) {
						console.log("Please enter correct item Id");
						break;
					}
					let deletedItemMessage = await this.adminHandlers.handleDeleteItem(
						id
					);
					console.table(deletedItemMessage);
					break;
				case "4":
					let items = await this.adminHandlers.viewItems();
					if (items.length === 0) {
						console.log("No records found.");
					} else {
						console.table(items);
					}
					break;
				case "5":
					let mealTypes = await this.adminHandlers.viewMealTypes();
					console.table(mealTypes);
					break;
				case "6":
					let discardMenuItemList =
						await this.adminHandlers.viewDiscardMenuItemList();
					if (discardMenuItemList.length === 0) {
						console.log("No record found.");
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
								let message = await this.adminHandlers.handleDeleteItem(
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
									await this.adminHandlers.handleSendNotificationForDetailedFeedback(
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
				case "7":
					let logs = await this.adminHandlers.viewLog();
					if (logs.length === 0) {
						console.log("No logs found.");
					} else {
						console.table(logs);
					}
					break;
				case "8":
					let logoutMessage = await this.adminHandlers.logout();
					console.log(logoutMessage);
					await this.authenticationService.authenticate();
					isConsoleRunning = false;
					break;
				default:
					console.log("Invalid action. Please try again.");
			}
		}
	}
}

export default AdminConsole;
