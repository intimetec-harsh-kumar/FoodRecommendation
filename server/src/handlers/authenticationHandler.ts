import { Socket } from "socket.io";
import AuthenticationService from "../services/authenticationService";

class authenticationHandler {
	public async handleAuthenticate(
		socket: Socket,
		email: string
	): Promise<void> {
		const user = await AuthenticationService.authenticateUser(email);
		console.log("in authhandler", user);

		socket.emit("authenticated", user);
		if (user.length > 0) {
			console.log(`Email ${email} authenticated successfully.`);
		} else {
			console.log(`Email ${email} authentication failed.`);
		}
	}
}
export default new authenticationHandler();
