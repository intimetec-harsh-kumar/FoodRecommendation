import { Socket } from "socket.io";
import NotificationService from "../services/notificationService";

class NotificationHandler {
	public async handleViewNotifications(
		socket: Socket,
		callback: (response: {
			notification: {
				Id: number;
				NotificationTypeId: number;
				Message: string;
				Date: any;
			}[];
		}) => void
	): Promise<void> {
		try {
			const notification: any = await NotificationService.getNotification();
			callback({ notification: notification });
		} catch (error) {
			console.error("Error retrieving items:", error);
		}
	}
}
export default new NotificationHandler();
