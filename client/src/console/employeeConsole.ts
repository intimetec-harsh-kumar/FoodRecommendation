import InputHandlerService from "../services/inputHandlerService";
import SocketService from "../services/socketService";
import EmployeeHandlers from "../handlers/employeeHandlers";
import AuthenticationService from "../services/authenticationService";
import { Constants } from "../constants/constant";

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
					`Employee: Choose an action (\n 1: ${Constants.ViewItem} \n 2: ${Constants.ViewTodaysMenu}\n 3: ${Constants.SendFeedback} \n 4: ${Constants.ChooseNextDayFood} \n 5: ${Constants.UpdateProfile} \n 6: ${Constants.Logout}\n): `
				)
			);

			switch (action) {
				case 1:
					let menuItems = await this.employeeHandlers.viewMenuItems();
					if (menuItems.length === 0) {
						console.log(Constants.Logout);
					} else {
						console.table(menuItems);
					}
					break;
				case 2:
					let notifications = await this.employeeHandlers.viewNotifications(
						Constants.NotificationIdForTodaysPreparedFood
					);
					if (notifications.length === 0) {
						console.log(Constants.NoRecordFound);
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
						await this.employeeHandlers.viewNotifications(
							Constants.NotificationIdForFoodRecommendation
						);
					if (rolledOutFoodItems.length == 0) {
						console.log(Constants.NoRecordFound);
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
					const validSpiceLevels = ["low", "medium", "high"];
					const validFoodTypes = ["vegeterian", "non vegeterian"];
					const validOriginality = ["north indian", "south indian", "others"];
					const food_type = await InputHandlerService.askQuestion(
						"Enter food type (vegeterian,non vegeterian): "
					);
					if (!validFoodTypes.includes(food_type)) {
						console.log("Invalid selection");
						break;
					}
					const spice_level = await InputHandlerService.askQuestion(
						"Enter spice level (low,medium,high): "
					);
					if (!validSpiceLevels.includes(spice_level)) {
						console.log("Invalid selection");
						break;
					}
					const originality = await InputHandlerService.askQuestion(
						"Enter from where the food belongs (north indian,south indian,others): "
					);
					if (!validOriginality.includes(originality)) {
						console.log("Invalid selection");
						break;
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
					console.log(message);
					break;
				case 6:
					let logoutMessage = await this.employeeHandlers.logout();
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

export default EmployeeConsole;
