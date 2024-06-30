import UserDetail from "../User/userDetail";
import pool from "../config/dbConnection";
import { FeedbackRepository } from "../repository/feedbackRepository";
import { GenericRepository } from "../repository/genericRepository";
import SentimentService from "./sentimentService";

class FeedbackService {
	async provideFeedback(feedback: any): Promise<any> {
		try {
			const connection = await pool.getConnection();
			feedback.user_email = UserDetail.getUserDetail();
			const sentimentScore = await SentimentService.analyzeFeedbackSentiments(
				feedback.comment
			);
			const feedbackRepository = new FeedbackRepository(pool, "Feedback");
			const [rows]: any = await feedbackRepository.provideFeedback(
				feedback,
				sentimentScore
			);
			connection.release();
			return rows.affectedRows ? rows : [];
		} catch (error) {
			throw error;
		}
	}
}
export default new FeedbackService();
