import { Socket } from "socket.io";
import AuthenticationService from "../services/authenticationService";
import UserDetail from "../User/userDetail";
import DateService from "../services/dateService";
import LogService from "../services/logService";

class authenticationHandler {
	public async handleAuthenticate(
		socket: Socket,
		email: string
	): Promise<void> {
		const user = await AuthenticationService.authenticateUser(email);
		console.log("in authhandler", user);
		UserDetail.setUserDetail(email);
		socket.emit("authenticated", user);
		if (user.length > 0) {
			console.log(`Email ${email} authenticated successfully.`);
			let userEmail = UserDetail.getUserDetail();
			let logObject = {
				userEmail: userEmail,
				action: "authentication",
				timestamp: DateService.getCurrentTimestamp(),
			};
			LogService.addLogs(logObject);
		} else {
			console.log(`Email ${email} authentication failed.`);
		}
	}
}
export default new authenticationHandler();
