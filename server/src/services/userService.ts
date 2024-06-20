import pool from "../config/dbConnection";
import UserDetail from "../User/userDetail";
import { Users } from "../models/Users";
import { GenericRepository } from "../repository/genericRepository";
import { UserRepository } from "../repository/userRepository";

class UserService {
	async getUsers() {
		const users = new UserRepository(pool, "Users");
		const rows = await users.getAll();
		return rows;
	}

	async getUserByEmail(email: string): Promise<any[]> {
		try {
			const connection = await pool.getConnection();
			const genericRepository = new GenericRepository<Users>(pool, "Users");
			const rows: any = await genericRepository.getByEmail(email);
			console.log("inside userService", rows);
			connection.release();
			return rows as any[];
		} catch (err) {
			console.error("Database error:", err);
			throw err;
		}
	}
	// async getRoleUser(email: string): Promise<any[]> {
	// 	try {
	// 		const connection = await pool.getConnection();
	// 		const genericRepository = new GenericRepository<Users>(pool, "Users");
	// 		const rows: any = await genericRepository.getByEmail(email);
	// 		console.log("inside userService", rows);
	// 		connection.release();
	// 		return rows as any[];
	// 	} catch (err) {
	// 		console.error("Database error:", err);
	// 		throw err;
	// 	}
	// }
	async getUserEmail(): Promise<string | null> {
		let email: string | null = await UserDetail.getUserDetail();
		return email;
	}
}
export default new UserService();
