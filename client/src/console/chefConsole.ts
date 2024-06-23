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
					"Chef: Choose an action (\n 1: View Menu Items \n 2: View Meal Types \n 3: View Notifications \n 4: View Available Food Items \n 5: Send Notification \n 6: View Recommendations \n 7: Logout \n): "
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
