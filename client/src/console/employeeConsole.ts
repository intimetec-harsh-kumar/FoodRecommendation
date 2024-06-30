import InputHandlerService from "../services/inputHandlerService";
import SocketService from "../services/socketService";
import EmployeeHandlers from "../handlers/employeeHandlers";

class EmployeeConsole {
	private employeeHandlers: EmployeeHandlers;

	constructor(private socketService: SocketService) {
		this.employeeHandlers = new EmployeeHandlers(
			this.socketService.getSocket()
		);
	}

	async start() {
		let isConsoleRunning = true;
		while (isConsoleRunning) {
			const action = parseInt(
				await InputHandlerService.askQuestion(
					"Employee: Choose an action (\n 1: View Menu Items \n 2: View Notification\n 3: Send Feedback \n 4: Choose Item for next day \n 5:Logout\n): "
				)
			);

			switch (action) {
				case 1:
					let menuItems = await this.employeeHandlers.viewMenuItems();
					console.table(menuItems);
					break;
				case 2:
					let notifications: any =
						await this.employeeHandlers.viewNotifications(4);
					console.table(notifications);
					break;
				case 3:
					const foodItemId = await InputHandlerService.askQuestion(
						"Enter item Id: "
					);
					const rating = await InputHandlerService.askQuestion(
						"Enter your rating (0-5): "
					);
					const comment = await InputHandlerService.askQuestion(
						"Enter you feedback: "
					);
					let feedbackMessage = await this.employeeHandlers.provideFeedback(
						foodItemId,
						rating,
						comment
					);
					console.log(feedbackMessage);
					break;
				case 4:
					let rolledOutFoodItems: any =
						await this.employeeHandlers.viewNotifications(4);
					console.table(rolledOutFoodItems);
					console.log(
						"Rolled Out Food Item Ids : " +
							rolledOutFoodItems.map((item: any) => item.id).join(",")
					);
					const selectedFoodItemIds = await InputHandlerService.askQuestion(
						"Enter item Id to select for next day seperated by comma : "
					);
					const rolledOutFoodItemIds = new Set(
						rolledOutFoodItems.map((item: any) => item.id)
					);
					const invalidFoodItemIds: string[] = [];
					selectedFoodItemIds.split(",").forEach((id) => {
						if (!rolledOutFoodItemIds.has(parseInt(id.trim()))) {
							invalidFoodItemIds.push(id.trim());
						}
					});
					if (invalidFoodItemIds.length > 0) {
						console.log(
							"Invalid Food Item Ids: " + invalidFoodItemIds.join(",")
						);
						console.log(
							"Please enter valid Food Item Ids from the list: " +
								rolledOutFoodItems.map((item: any) => item.Id).join(",")
						);
					} else {
						await this.employeeHandlers.selectFoodItemForNextDay(
							selectedFoodItemIds
						);
					}
					break;
				case 5:
					await this.employeeHandlers.logout();
					isConsoleRunning = false;
					break;
				default:
					console.log("Invalid action. Please try again.");
			}
		}
	}
}

export default EmployeeConsole;
