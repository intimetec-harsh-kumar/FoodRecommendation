import { Socket } from "socket.io";
import FeedbackService from "../services/feedbackService";
import ConsoleService from "../services/consoleService";

class FeedbackHandler {
	public async handleProvideFeedback(
		socket: Socket,
		feedback: any,
		callback: (response: { message: string; error?: string }) => void
	) {
		try {
			const addedFeedback = await FeedbackService.provideFeedback(
				socket,
				feedback
			);
			if (addedFeedback) {
				ConsoleService.displayMessage(`feedback added successfullys`);
				callback({
					message: `feedback added successfully`,
				});
			} else {
				ConsoleService.displayMessage(`Failed to add a feedback`);
				callback({
					message: `Failed to add a feedback`,
				});
			}
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({
				message: "An error occurred while adding a feedback",
				error: `Error occured: ${error.message}`,
			});
		}
	}
}
export default new FeedbackHandler();
