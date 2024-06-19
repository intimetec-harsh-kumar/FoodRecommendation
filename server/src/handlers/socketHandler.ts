import { Socket } from "socket.io";

class SocketHandler {
	public handleRegister(socket: Socket, clientId: string): void {
		console.log(`Registering client with ID: ${clientId}`);
		console.log(`Client ID received: ${clientId}`);
	}

	public handleDisconnect(socket: Socket): void {
		console.log(`Client with ID ${socket.id} disconnected`);
	}
}

export default new SocketHandler();
