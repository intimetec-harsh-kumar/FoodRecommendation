import Sentiment from "sentiment";

class SentimentAnalysisService {
	private sentiment: Sentiment;

	constructor() {
		this.sentiment = new Sentiment();
	}

	async analyzeFeedbackSentiments(feedbackComment: any): Promise<number> {
		const result = this.sentiment.analyze(feedbackComment);
		return result.score;
	}
}
export default new SentimentAnalysisService();
