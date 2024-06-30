import { GenericRepository } from "./genericRepository";

export class FeedbackRepository extends GenericRepository<any> {
	async provideFeedback(entity: any, sentimentScore: number): Promise<void> {
		try {
			await this.pool.query(`SET @Sentiment_Score = ?`, [sentimentScore]);
			const row: any = await this.pool.query(
				`INSERT INTO Feedback SET ?`,
				entity
			);
			return row.length > 0 ? row : null;
		} catch (error) {
			throw error;
		}
	}
}
