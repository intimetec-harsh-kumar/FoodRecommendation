import InputHandlerService from "../services/inputHandlerService";
import SocketService from "../services/socketService";
import ChefHandlers from "../handlers/chefHandlers";
import AuthenticationService from "../services/authenticationService";
import ChefService from "../services/chefService";
import { Constants } from "../constants/constant";

class ChefConsole {
	private chefService: ChefService;
	private authenticationService: AuthenticationService;

	constructor(private socketService: SocketService) {
		const chefHandlers = new ChefHandlers(this.socketService.getSocket());
		this.authenticationService = new AuthenticationService(
			this.socketService.getSocket()
		);
		this.chefService = new ChefService(
			chefHandlers,
			this.authenticationService
		);
	}

	async start() {
		let isConsoleRunning = true;
		while (isConsoleRunning) {
			const action = parseInt(
				await InputHandlerService.askQuestion(
					`Chef: Choose an action (\n 1: ${Constants.ViewItem} \n 2: ${Constants.ViewMealType} \n 3: ${Constants.ViewNotification} \n 4: ${Constants.ViewAvailableItems} \n 5: ${Constants.SendNotification} \n 6: ${Constants.ViewRecommendation} \n 7: ${Constants.ViewVotedItems} \n 8: ${Constants.ViewDiscardedItem} \n 9: ${Constants.PrepareFood} \n 10: ${Constants.Logout} \n): `
				)
			);

			switch (action) {
				case 1:
					await this.chefService.handleViewItems();
					break;
				case 2:
					await this.chefService.handleViewMealTypes();
					break;
				case 3:
					await this.chefService.handleViewNotifications();
					break;
				case 4:
					await this.chefService.handleViewAvailableItems();
					break;
				case 5:
					await this.chefService.handleSendNotification();
					break;
				case 6:
					await this.chefService.handleViewRecommendation();
					break;
				case 7:
					await this.chefService.handleViewVotedItems();
					break;
				case 8:
					await this.chefService.handleViewDiscardedItems();
					break;
				case 9:
					await this.chefService.handlePrepareFood();
					break;
				case 10:
					await this.chefService.handleLogout();
					isConsoleRunning = false;
					break;
				default:
					console.log(Constants.InValidAction);
			}
		}
	}
}

export default ChefConsole;
