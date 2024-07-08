import { Socket } from "socket.io";
import FoodItemhandler from "../handlers/foodItemhandler";
import NotificationHandler from "../handlers/notificationHandler";
import AuthenticationHandler from "../handlers/authenticationHandler";
import SocketHandler from "../handlers/socketHandler";
import UserDetail from "../User/userDetail";
import logHandler from "../handlers/logHandler";
import FoodRecommendationHandler from "../handlers/foodRecommendationHandler";
import FeedbackHandler from "../handlers/feedbackHandler";
import foodItemhandler from "../handlers/foodItemhandler";
import { ILog } from "../models/ILog";
import { INotification } from "../models/INotification";
import { IFoodItem } from "../models/IFoodItem";
import { IMealType } from "../models/IMealType";

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
				callback: (response: { items: IFoodItem[]; error?: string }) => void
			) => {
				FoodItemhandler.handleViewItems(socket, callback);
			}
		);

		socket.on(
			"viewMealTypes",
			(callback: (response: { mealType: IMealType[] }) => void) => {
				FoodItemhandler.handleViewMealTypes(socket, callback);
			}
		);

		socket.on(
			"viewNotifications",
			(
				notificationTypeId: number | undefined,
				callback: (response: { notification: INotification[] }) => void
			) => {
				NotificationHandler.handleViewNotifications(
					callback,
					notificationTypeId
				);
			}
		);

		socket.on(
			"viewAvailableFoodItems",
			(callback: (response: { items: IFoodItem[] }) => void) => {
				FoodItemhandler.handleViewAvailableFoodItems(socket, callback);
			}
		);

		socket.on(
			"viewLog",
			(callback: (response: { log: Partial<ILog>[] }) => void) => {
				logHandler.handleViewLogs(socket, callback);
			}
		);

		socket.on(
			"selectFoodItemForNextDay",
			(
				foodItemIds: string,
				callback: (response: { message: string }) => void
			) => {
				FoodItemhandler.selectFoodItemForNextDay(foodItemIds, callback);
			}
		);

		socket.on("logout", (callback: (response: { message: string }) => void) => {
			let userEmail = UserDetail.getUserDetail();
			console.log(`User ${userEmail} logged out`);
			UserDetail.clearUserDetail();
			callback({ message: `User ${userEmail} logged out` });
		});

		socket.on(
			"viewRecommendations",
			(
				mealType,
				numberOfRecommendation,
				callback: (response: { recommendations: any[] }) => void
			) => {
				FoodRecommendationHandler.handleViewRecommendation(
					socket,
					mealType,
					numberOfRecommendation,
					callback
				);
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
			(
				foodItemIdsToRollOutForNextDay,
				callback: (response: { message: string }) => void
			) => {
				NotificationHandler.handleSendNotificationsForNextDay(
					foodItemIdsToRollOutForNextDay,
					callback
				);
			}
		);
		socket.on(
			"viewVotedItems",
			(callback: (response: { votedItems: any[] }) => void) => {
				foodItemhandler.handleViewVotedItems(socket, callback);
			}
		);
		socket.on(
			"viewDiscardMenuItemList",
			(
				callback: (response: { items: IFoodItem[]; error?: string }) => void
			) => {
				FoodRecommendationHandler.handleViewDiscardMenuItemList(
					socket,
					callback
				);
			}
		);
		socket.on(
			"sendNotificationForDetailedFeedback",
			(
				foodItemIdForDetailedFeedback,
				questions,
				callback: (response: { message: string; error?: string }) => void
			) => {
				NotificationHandler.handleSendNotificationForDetailedFeedback(
					foodItemIdForDetailedFeedback,
					questions,
					callback
				);
			}
		);
	}
}

export default new SocketService();
