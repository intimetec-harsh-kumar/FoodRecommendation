import InputHandlerService from "../services/inputHandlerService";
import SocketService from "../services/socketService";
import EmployeeHandlers from "../handlers/employeeHandlers";
import AuthenticationService from "../services/authenticationService";
import { INotification } from "../models/INotification";

class EmployeeConsole {
	private employeeHandlers: EmployeeHandlers;
	private authenticationService: AuthenticationService;

	constructor(private socketService: SocketService) {
		this.employeeHandlers = new EmployeeHandlers(
			this.socketService.getSocket()
		);
		this.authenticationService = new AuthenticationService(
			this.socketService.getSocket()
		);
	}

	async start() {
		let isConsoleRunning = true;
		while (isConsoleRunning) {
			const action = parseInt(
				await InputHandlerService.askQuestion(
					"Employee: Choose an action (\n 1: View Menu Items \n 2: View Today's Menu\n 3: Send Feedback \n 4: Choose Item for next day \n 5: Logout\n): "
				)
			);

			switch (action) {
				case 1:
					let menuItems = await this.employeeHandlers.viewMenuItems();
					if (menuItems.length === 0) {
						console.log("No records found.");
					} else {
						console.table(menuItems);
					}
					break;
				case 2:
					let notifications = await this.employeeHandlers.viewNotifications(4);
					if (notifications.length === 0) {
						console.log("There is no notification yet.");
					} else {
						console.table(notifications);
					}
					break;
				case 3:
					let foodItems = await this.employeeHandlers.viewMenuItems();
					const foodItemIds = new Set(foodItems.map((item: any) => item.id));
					const food_item_id = await InputHandlerService.askQuestion(
						"Enter item Id: "
					);
					if (!foodItemIds.has(parseInt(food_item_id))) {
						console.log("Please enter a valid foodItem Id");
						break;
					}
					const rating = await InputHandlerService.askQuestion(
						"Enter your rating (0-5): "
					);
					if (0 > parseInt(rating) || parseInt(rating) > 5) {
						console.log("Please enter the rating in the range 0-5 only.");
						break;
					}
					const comment = await InputHandlerService.askQuestion(
						"Enter you feedback: "
					);
					let feedbackMessage = await this.employeeHandlers.provideFeedback(
						food_item_id,
						rating,
						comment
					);
					console.log(feedbackMessage);
					break;
				case 4:
					let rolledOutFoodItems: any =
						await this.employeeHandlers.viewNotifications(4);
					if (rolledOutFoodItems.length == 0) {
						console.log("No records found");
					} else {
						console.table(
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
						console.log("Rolled Out Food Item Ids : " + rolledOutFoodItemsId);
						const selectedFoodItemIds = await InputHandlerService.askQuestion(
							"Enter item Id to select for next day seperated by comma : "
						);
						const invalidFoodItemIds: string[] = [];
						selectedFoodItemIds.split(",").forEach((id) => {
							if (!rolledOutFoodItemsId.split(",").includes(id)) {
								invalidFoodItemIds.push(id);
							}
						});
						if (invalidFoodItemIds.length > 0) {
							console.log(
								"Invalid Food Item Ids: " +
									invalidFoodItemIds.join(",") +
									"\n" +
									"Please enter valid Food Item Ids from : " +
									rolledOutFoodItemsId
							);
						} else {
							await this.employeeHandlers.selectFoodItemForNextDay(
								selectedFoodItemIds
							);
						}
					}
					break;
				case 5:
					let logoutMessage = await this.employeeHandlers.logout();
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

export default EmployeeConsole;
