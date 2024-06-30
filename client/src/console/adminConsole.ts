import InputHandlerService from "../services/inputHandlerService";
import SocketService from "../services/socketService";
import AdminHandlers from "../handlers/adminHandlers";

class AdminConsole {
	private adminHandlers: AdminHandlers;

	constructor(private socketService: SocketService) {
		this.adminHandlers = new AdminHandlers(this.socketService.getSocket());
	}

	async start() {
		let isConsoleRunning = true;
		while (isConsoleRunning) {
			const action = await InputHandlerService.askQuestion(
				"Admin: Choose an action (\n 1: addItem\n 2: update \n 3: delete \n 4: view \n 5: meal types \n 6: View Discard MenuItem List \n 7: viewLog \n 8: Logout\n): "
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
					var item_name = await InputHandlerService.askQuestion(
						"Enter new item name: "
					);
					var price = parseFloat(
						await InputHandlerService.askQuestion("Enter new item price: ")
					);
					var availability_status =
						(await InputHandlerService.askQuestion(
							"Is the item available? (yes/no): "
						)) === "yes";
					var meal_type_id = parseInt(
						await InputHandlerService.askQuestion("Enter new meal type ID: ")
					);
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
					let deletedItemMessage = await this.adminHandlers.handleDeleteItem(
						id
					);
					console.table(deletedItemMessage);
					break;
				case "4":
					let items = await this.adminHandlers.viewItems();
					console.table(items);
					break;
				case "5":
					let mealTypes = await this.adminHandlers.viewMealTypes();
					console.table(mealTypes);
					break;
				case "6":
					let discardMenuItemList =
						await this.adminHandlers.viewDiscardMenuItemList();
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
					console.table(logs);
					break;
				case "8":
					await this.adminHandlers.logout();
					isConsoleRunning = false;
					return;
				default:
					console.log("Invalid action. Please try again.");
			}
		}
	}
}

export default AdminConsole;
