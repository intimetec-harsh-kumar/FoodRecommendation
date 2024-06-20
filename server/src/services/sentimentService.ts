import Sentiment from "sentiment";

class SentimentAnalysisService {
	private sentiment: Sentiment;

	constructor() {
		this.sentiment = new Sentiment();
	}

	async analyzeFeedbackSentiments(
		feedbacks: any[]
	): Promise<{ feedback_id: number; sentiment: number }[]> {
		const sentimentResults = feedbacks.map((feedback) => {
			const result = this.sentiment.analyze(feedback.comment);
			return {
				feedback_id: feedback.feedback_id,
				sentiment: result.score,
				rating: feedback.rating,
			};
		});

		return sentimentResults;
	}
}

export const sentimentAnalysisService = new SentimentAnalysisService();
