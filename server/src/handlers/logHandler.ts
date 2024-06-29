import { Socket } from "socket.io";
import logService from "../services/logService";

class LogHandler {
	public async handleViewLogs(
		socket: Socket,
		callback: (response: {
			log: { id: number; user_email: string; action: string }[];
			error?: string;
		}) => void
	): Promise<any> {
		try {
			const logs = await logService.getLogs();
			callback({ log: logs });
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({ log: [], error: `Error occured: ${error.message}` });
		}
	}
}
export default new LogHandler();
