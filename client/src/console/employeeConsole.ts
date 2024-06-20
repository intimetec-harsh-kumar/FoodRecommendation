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
					"Employee: Choose an action (1: View Menu Items, 2: View Notification,\n 3: Send Feedback, 4: Logout,\n): "
				)
			);

			switch (action) {
				case 1:
					await this.employeeHandlers.viewMenuItems();
					break;
				case 2:
					await this.employeeHandlers.viewNotifications();
					break;
				case 3:
					await this.employeeHandlers.provideFeedback();
					break;
				case 4:
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
