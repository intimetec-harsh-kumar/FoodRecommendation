import { Socket } from "socket.io";
import logService from "../services/logService";
import { ILog } from "../models/ILog";

class LogHandler {
	public async handleViewLogs(
		socket: Socket,
		callback: (response: { log: ILog[]; error?: string }) => void
	): Promise<void> {
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
