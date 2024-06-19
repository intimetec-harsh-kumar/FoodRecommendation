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

	async start(): Promise<void> {
		const action = await InputHandlerService.askQuestion(
			"Choose an action: viewAvailableItems, placeOrder: "
		);
		switch (action) {
			case "viewAvailableItems":
				await this.employeeHandlers.viewAvailableItems();
				break;
			case "placeOrder":
				await this.employeeHandlers.placeOrder();
				break;
			default:
				console.log("Invalid action");
				await this.start();
		}
	}
}

export default EmployeeConsole;
