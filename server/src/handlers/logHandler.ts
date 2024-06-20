import { Socket } from "socket.io";
import logService from "../services/logService";
import UserDetail from "../User/userDetail";

class LogHandler {
	public async handleViewLogs(
		socket: Socket,
		callback: (response: {
			log: { id: number; userEmail: string; action: string }[];
		}) => void
	): Promise<any> {
		try {
			const logs = await logService.getLogs();
			callback({ log: logs });
		} catch (err) {
			console.error("Error retrieving items:", err);
		}
	}
}
export default new LogHandler();
