import { Socket } from "socket.io";
import ConsoleService from "../services/consoleService";

class SocketHandler {
	public handleRegister(socket: Socket, clientId: string): void {
		try {
			ConsoleService.displayMessage(`Registering client with ID: ${clientId}`);
		} catch (error: any) {
			ConsoleService.displayMessage(`Error occured: ${error.message}`);
		}
	}

	public handleDisconnect(socket: Socket): void {
		try {
			ConsoleService.displayMessage(`Client with ID ${socket.id} disconnected`);
		} catch (error: any) {
			ConsoleService.displayMessage(`Error occured: ${error.message}`);
		}
	}
}

export default new SocketHandler();
