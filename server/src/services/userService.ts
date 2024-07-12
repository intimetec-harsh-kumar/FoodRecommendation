import pool from "../config/dbConnection";
import UserDetail from "../User/userDetail";
import { IUsers } from "../models/IUsers";
import { GenericRepository } from "../repository/genericRepository";
import { UserRepository } from "../repository/userRepository";

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

	async getUserEmail(): Promise<string | undefined> {
		try {
			let email: string | undefined = UserDetail.getUserDetail();
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
	async updateProfile(profileData: any): Promise<boolean> {
		try {
			let userRepository = new UserRepository(pool, "User");
			profileData.user_email = UserDetail.getUserDetail();
			const isProfileUpdated = await userRepository.updateProfile(profileData);
			return isProfileUpdated;
		} catch (error) {
			throw error;
		}
	}
}
export default new UserService();
