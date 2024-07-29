import Sentiment from "sentiment";

class SentimentAnalysisService {
	private sentiment: Sentiment;

	constructor() {
		this.sentiment = new Sentiment();
	}

	async analyzeFeedbackSentiments(feedbackComment: any): Promise<number> {
		try {
			const result = this.sentiment.analyze(feedbackComment);
			return result.score;
		} catch (error) {
			throw error;
		}
	}
}
export default new SentimentAnalysisService();
