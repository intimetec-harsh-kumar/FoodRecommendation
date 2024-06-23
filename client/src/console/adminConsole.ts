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
				"Admin: Choose an action (\n 1: addItem\n 2: update \n 3: delete \n 4: view \n 5: meal types \n 6: Logout \n 7: viewLog \n): "
			);
			switch (action) {
				case "1":
					await this.adminHandlers.addItem();
					break;
				case "2":
					await this.adminHandlers.updateItem();
					break;
				case "3":
					await this.adminHandlers.deleteItem();
					break;
				case "4":
					await this.adminHandlers.viewItems();
					break;
				case "5":
					await this.adminHandlers.viewMealTypes();
					break;
				case "6":
					await this.adminHandlers.logout();
					isConsoleRunning = false;
					return;
				case "7":
					await this.adminHandlers.viewLog();
					break;
				default:
					console.log("Invalid action. Please try again.");
			}
		}
	}
}

export default AdminConsole;
