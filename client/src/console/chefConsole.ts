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
					"Chef: Choose an action (1: View Menu Items, 2: View Meal Types, 3: View Notifications, 4: View Available Food Items, 5: Send Notification, 6: View Recommendations, 7: Logout): "
				)
			);

			switch (action) {
				case 1:
					await this.chefHandlers.viewMenuItems();
					break;
				case 2:
					await this.chefHandlers.viewMealTypes();
					break;
				case 3:
					await this.chefHandlers.viewNotifications();
					break;
				case 4:
					await this.chefHandlers.viewAvailableFoodItems();
					break;
				case 5:
					await this.chefHandlers.sendFoodNotification();
					break;
				case 6:
					await this.chefHandlers.viewRecommendations();
					break;
				case 7:
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
