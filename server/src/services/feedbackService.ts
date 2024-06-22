import { log } from "console";
import UserDetail from "../User/userDetail";
import pool from "../config/dbConnection";
import { GenericRepository } from "../repository/genericRepository";

class FeedbackService {
	async provideFeedback(feedback: any): Promise<any> {
		try {
			const connection = await pool.getConnection();
			feedback.userEmail = UserDetail.getUserDetail();
			const genericRepository = new GenericRepository(pool, "Feedback");
			const [rows]: any = await genericRepository.add(feedback);
			console.log(rows);

			connection.release();
			return rows.affectedRows ? rows : [];
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	}
}
export default new FeedbackService();
