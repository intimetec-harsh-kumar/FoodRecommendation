import { Socket } from "socket.io";
import AuthenticationService from "../services/authenticationService";
import User from "../shared/user";
import DateService from "../services/dateService";
import LogService from "../services/logService";
import ConsoleService from "../services/consoleService";

class authenticationHandler {
	public async handleAuthenticate(
		socket: Socket,
		email: string
	): Promise<void> {
		try {
			const user = await AuthenticationService.authenticateUser(email);
			User.setLoggedInUserEmail(socket.id, email);
			socket.emit("authenticated", user);
			if (user.length > 0) {
				ConsoleService.displayMessage(
					`Email ${email} authenticated successfully.`
				);
				let logObject = {
					user_email: email,
					action: "authentication",
					timestamp: DateService.getCurrentTimestamp(),
				};
				LogService.addLogs(logObject);
			} else {
				ConsoleService.displayMessage(`Email ${email} authentication failed.`);
			}
		} catch (error: any) {
			ConsoleService.displayMessage(`Error occured: ${error.message}`);
		}
	}
}
export default new authenticationHandler();
