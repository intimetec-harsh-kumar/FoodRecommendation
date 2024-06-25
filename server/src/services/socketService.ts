import { Socket } from "socket.io";
import FoodItemhandler from "../handlers/foodItemhandler";
import NotificationHandler from "../handlers/notificationHandler";
import AuthenticationHandler from "../handlers/authenticationHandler";
import SocketHandler from "../handlers/socketHandler";
import UserDetail from "../User/userDetail";
import logHandler from "../handlers/logHandler";
import FoodRecommendationHandler from "../handlers/foodRecommendationHandler";
import FeedbackHandler from "../handlers/feedbackHandler";

class SocketService {
	handleConnection(socket: Socket): void {
		console.log("Client connected with", socket.id);

		socket.on("register", (clientId) => {
			SocketHandler.handleRegister(socket, clientId);
		});

		socket.on("authenticate", async (email) => {
			await AuthenticationHandler.handleAuthenticate(socket, email);
		});

		socket.on("addItem", (item, callback) =>
			FoodItemhandler.handleAddItem(socket, item, callback)
		);

		socket.on("updateItem", (item, callback) =>
			FoodItemhandler.handleUpdateItem(socket, item, callback)
		);

		socket.on(
			"deleteItem",
			(
				itemId: number,
				callback: (response: { success: boolean; message: string }) => void
			) => {
				FoodItemhandler.handleDeleteItem(socket, itemId, callback);
			}
		);

		socket.on(
			"viewItems",
			(
				callback: (response: {
					items: {
						id: number;
						item_name: string;
						price: number;
						availability_status: number;
						meal_type_id: number;
					}[];
				}) => void
			) => {
				FoodItemhandler.handleViewItems(socket, callback);
			}
		);

		socket.on(
			"viewMealTypes",
			(
				callback: (response: {
					mealType: { id: number; type_name: string }[];
				}) => void
			) => {
				FoodItemhandler.handleViewMealTypes(socket, callback);
			}
		);

		socket.on(
			"viewNotifications",
			(
				notificationTypeId: number | undefined,
				callback: (response: {
					notification: {
						Id: number;
						NotificationTypeId: number;
						Message: string;
						Date: any;
					}[];
				}) => void
			) => {
				NotificationHandler.handleViewNotifications(
					callback,
					notificationTypeId
				);
			}
		);

		socket.on(
			"viewAvailableFoodItems",
			(
				callback: (response: {
					items: {
						id: number;
						item_name: string;
						price: number;
						availability_status: number;
						meal_type_id: number;
					}[];
				}) => void
			) => {
				FoodItemhandler.handleViewAvailableFoodItems(socket, callback);
			}
		);

		socket.on(
			"viewLog",
			(
				callback: (response: {
					log: {
						id: number;
						userEmail: string;
						action: string;
					}[];
				}) => void
			) => {
				logHandler.handleViewLogs(socket, callback);
			}
		);

		socket.on(
			"selectFoodItemForNextDay",
			(
				foodItemId: number,
				callback: (response: { message: string }) => void
			) => {
				console.log("in ss", foodItemId);

				FoodItemhandler.selectFoodItemForNextDay(foodItemId, callback);
			}
		);

		socket.on("logout", () => {
			console.log(`User ${socket.id} logged out`);
			UserDetail.clearUserDetail();
			socket.disconnect(true);
		});

		socket.on(
			"viewRecommendations",
			(callback: (response: { recommendations: any[] }) => void) => {
				FoodRecommendationHandler.handleViewRecommendation(socket, callback);
			}
		);

		socket.on("disconnect", () => {
			SocketHandler.handleDisconnect(socket);
		});

		socket.on("provideFeedback", (feedback, callback) =>
			FeedbackHandler.handleProvideFeedback(socket, feedback, callback)
		);
		socket.on(
			"sendFoodItemNotificationForNextDay",
			(callback: (response: { message: string }) => void) => {
				NotificationHandler.handleSendNotifications();
			}
		);
	}
}

export default new SocketService();
