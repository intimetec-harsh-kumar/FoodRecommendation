import pool from "../config/dbConnection";
import User from "../shared/user";
import { IUsers } from "../models/IUsers";
import { GenericRepository } from "../repository/genericRepository";
import { UserRepository } from "../repository/userRepository";
import { Socket } from "socket.io";

class UserService {
	async getUserByEmail(email: string): Promise<IUsers[]> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository<IUsers>(pool, "User");
			const rows: any = await genericRepository.getByEmail(email);
			connection.release();
			return rows as any[];
		} catch (error) {
			throw error;
		}
	}

	async getUserEmail(socket: Socket): Promise<string | undefined> {
		try {
			let email: string | undefined = User.getLoggedInUserEmail(socket.id);
			return email;
		} catch (error) {
			throw error;
		}
	}
	async getUserPreference(email: string): Promise<any> {
		try {
			let userRepository = new UserRepository(pool, "User");
			const rows = await userRepository.getUserPreference(email);
			return rows;
		} catch (error) {
			throw error;
		}
	}
	async updateProfile(socket: Socket, profileData: any): Promise<boolean> {
		try {
			let userRepository = new UserRepository(pool, "User");
			profileData.user_email = User.getLoggedInUserEmail(socket.id);
			const isProfileUpdated = await userRepository.updateProfile(profileData);
			return isProfileUpdated;
		} catch (error) {
			throw error;
		}
	}
}
export default new UserService();
