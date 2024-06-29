import UserDetail from "../User/userDetail";
import pool from "../config/dbConnection";
import { GenericRepository } from "../repository/genericRepository";
import SentimentService from "./sentimentService";

class FeedbackService {
	async provideFeedback(feedback: any): Promise<any> {
		try {
			const connection = await pool.getConnection();
			feedback.user_email = UserDetail.getUserDetail();
			const genericRepository = new GenericRepository(pool, "Feedback");
			const sentimentScore = await SentimentService.analyzeFeedbackSentiments(
				feedback.comment
			);
			await connection.query(`SET @NEW_Sentiment = ?`, [sentimentScore]);
			const [rows]: any = await genericRepository.add(feedback);
			connection.release();
			return rows.affectedRows ? rows : [];
		} catch (error) {
			throw error;
		}
	}
}
export default new FeedbackService();
