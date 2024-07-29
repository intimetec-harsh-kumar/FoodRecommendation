import InputHandlerService from "../services/inputHandlerService";
import AdminService from "../services/adminService";
import AdminHandlers from "../handlers/adminHandlers";
import AuthenticationService from "../services/authenticationService";
import { Constants } from "../constants/constant";
import SocketService from "../services/socketService";
import ConsoleService from "../services/consoleService";

class AdminConsole {
	private adminHandlers: AdminHandlers;
	private authenticationService: AuthenticationService;
	private adminActionService: AdminService;

	constructor(private socketService: SocketService) {
		this.adminHandlers = new AdminHandlers(this.socketService.getSocket());
		this.authenticationService = new AuthenticationService(
			this.socketService.getSocket()
		);
		this.adminActionService = new AdminService(this.adminHandlers);
	}

	async start() {
		let isConsoleRunning = true;

		while (isConsoleRunning) {
			const action = await InputHandlerService.askQuestion(
				`Admin: Choose an action (\n 1: ${Constants.AddItem}\n 2: ${Constants.UpdateItem} \n 3: ${Constants.DeleteItem} \n 4: ${Constants.ViewItem} \n 5: ${Constants.ViewMealType} \n 6: ${Constants.ViewDiscardedItem} \n 7: ${Constants.ViewLog} \n 8: ${Constants.Logout}\n): `
			);

			switch (action) {
				case "1":
					await this.adminActionService.addItem();
					break;
				case "2":
					await this.adminActionService.updateItem();
					break;
				case "3":
					await this.adminActionService.deleteItem();
					break;
				case "4":
					await this.adminActionService.viewItems();
					break;
				case "5":
					await this.adminActionService.viewMealTypes();
					break;
				case "6":
					await this.adminActionService.viewDiscardedItems();
					break;
				case "7":
					await this.adminActionService.viewLogs();
					break;
				case "8":
					await this.adminActionService.logout();
					await this.authenticationService.authenticate();
					isConsoleRunning = false;
					break;
				default:
					ConsoleService.displayMessage(Constants.InValidAction);
			}
		}
	}
}

export default AdminConsole;
