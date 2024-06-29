import { Socket } from "socket.io";

class SocketHandler {
	public handleRegister(socket: Socket, clientId: string): void {
		try {
			console.log(`Registering client with ID: ${clientId}`);
			console.log(`Client ID received: ${clientId}`);
		} catch (error: any) {
			console.log("Error occured:", error.message);
		}
	}

	public handleDisconnect(socket: Socket): void {
		try {
			console.log(`Client with ID ${socket.id} disconnected`);
		} catch (error: any) {
			console.log("Error occured:", error.message);
		}
	}
}

export default new SocketHandler();
