import { Socket } from "socket.io";
import FeedbackService from "../services/feedbackService";

class FeedbackHandler {
	public async handleProvideFeedback(
		socket: Socket,
		feedback: any,
		callback: (response: { message: string }) => void
	) {
		try {
			const addedFeedback = await FeedbackService.provideFeedback(feedback);
			if (addedFeedback) {
				console.log(`feedback added successfullys`);
				callback({
					message: `feedback added successfully`,
				});
			} else {
				console.log(`Failed to add a feedback`);
				callback({
					message: `Failed to add a feedback`,
				});
			}
		} catch (err) {
			console.error("Error adding a feedback:", err);
			callback({
				message: "An error occurred while adding a feedback",
			});
		}
	}
}
export default new FeedbackHandler();
