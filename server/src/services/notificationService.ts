import { Socket } from "socket.io";
import pool from "../config/dbConnection";
import { INotification } from "../models/INotification";
import { GenericRepository } from "../repository/genericRepository";
import { NotificationRepository } from "../repository/notificationRepository";
import User from "../shared/user";
import DateService from "./dateService";
import userService from "./userService";
import { Constants } from "../constants/constant";

class NotificationService {
	async pushNotification(notification: Partial<INotification>): Promise<any> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository(pool, "Notification");
			const rows: any = await genericRepository.add(notification);
			connection.release();
			return rows;
		} catch (error) {
			throw error;
		}
	}

	private async getUserPreference(socket: Socket): Promise<any> {
		const email: any = User.getLoggedInUserEmail(socket.id);
		const preferenceData = await userService.getUserPreference(email);
		return preferenceData;
	}

	private compareFunction(preferenceData: any) {
		return (a: any, b: any) => {
			if (a.message.food_type !== b.message.food_type) {
				if (a.message.food_type === preferenceData.food_type) return -1;
				if (b.message.food_type === preferenceData.food_type) return 1;
			}
			if (a.message.originality !== b.message.originality) {
				if (a.message.originality === preferenceData.originality) return -1;
				if (b.message.originality === preferenceData.originality) return 1;
			}
			if (a.message.spice_level !== b.message.spice_level) {
				if (a.message.spice_level === preferenceData.spice_level) return -1;
				if (b.message.spice_level === preferenceData.spice_level) return 1;
			}
			if (a.message.is_sweet !== b.message.is_sweet) {
				if (a.message.is_sweet === preferenceData.sweet_tooth) return -1;
				if (b.message.is_sweet === preferenceData.sweet_tooth) return 1;
			}
			return 0;
		};
	}

	private async getTodaysMenuOnTheBasisOfPreference(
		notificationTypeId: number,
		preferenceData: any
	): Promise<any> {
		const notificationRepository = new NotificationRepository(
			pool,
			"Notification"
		);
		const rows: any =
			await notificationRepository.getTodaysMenuOnTheBasisOfPreference(
				notificationTypeId
			);
		rows.sort(this.compareFunction(preferenceData));
		return rows;
	}

	private async getCurrentNotification(
		notificationTypeId?: number
	): Promise<any> {
		const notificationRepository = new NotificationRepository(
			pool,
			"Notification"
		);
		const rows: any = await notificationRepository.getCurrentNotification(
			notificationTypeId
		);
		return rows;
	}

	public async getNotification(
		socket: Socket,
		notificationTypeId?: number
	): Promise<any> {
		try {
			const connection = await pool.getConnection();
			if (notificationTypeId == Constants.NotificationIdForPreparedFood) {
				const preferenceData = await this.getUserPreference(socket);
				const rows = await this.getTodaysMenuOnTheBasisOfPreference(
					notificationTypeId,
					preferenceData
				);
				connection.release();
				return rows;
			} else {
				const rows = await this.getCurrentNotification(notificationTypeId);
				connection.release();
				return rows;
			}
		} catch (error) {
			throw error;
		}
	}

	async sendFoodItemNotificationForNextDay(
		foodItemIdsToRollOutForNextDay: string
	) {
		try {
			let genericRepository = new GenericRepository(pool, "Item");
			foodItemIdsToRollOutForNextDay.split(",").forEach(async (itemId) => {
				let item: any = await genericRepository.getById(itemId);
				let notification = {
					notification_type_id: Constants.NotificationIdForRecommedation,
					message: JSON.stringify({
						itemId: item[0].id,
						itemName: item[0].item_name,
					}),
					Date: DateService.getCurrentDate(),
				};
				this.pushNotification(notification);
			});
		} catch (error) {
			throw error;
		}
	}
	async sendNotificationForDetailedFeedback(
		foodItemIdForDetailedFeedback: number,
		questions: string
	) {
		try {
			let notification = {
				notification_type_id: Constants.NotificationIdForDetailedFeedback,
				message: `${Constants.FeedbackMessageForImprovement} ${questions}`,
				Date: DateService.getCurrentDate(),
			};
			this.pushNotification(notification);
		} catch (error) {
			throw error;
		}
	}
}
export default new NotificationService();
