import InputHandlerService from "../services/inputHandlerService";
import SocketService from "../services/socketService";
import EmployeeHandlers from "../handlers/employeeHandlers";
import AuthenticationService from "../services/authenticationService";
import EmployeeService from "../services/employeeService";
import { Constants } from "../constants/constant";

class EmployeeConsole {
	private employeeService: EmployeeService;
	private authenticationService: AuthenticationService;

	constructor(private socketService: SocketService) {
		const employeeHandlers = new EmployeeHandlers(
			this.socketService.getSocket()
		);
		this.authenticationService = new AuthenticationService(
			this.socketService.getSocket()
		);
		this.employeeService = new EmployeeService(employeeHandlers);
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
					await this.employeeService.handleViewItems();
					break;
				case 2:
					await this.employeeService.handleViewTodaysMenu();
					break;
				case 3:
					await this.employeeService.handleSendFeedback();
					break;
				case 4:
					await this.employeeService.handleChooseNextDayFood();
					break;
				case 5:
					await this.employeeService.handleUpdateProfile();
					break;
				case 6:
					await this.employeeService.handleLogout();
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
