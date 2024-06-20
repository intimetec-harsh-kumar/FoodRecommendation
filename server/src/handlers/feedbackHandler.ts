import { Socket } from "socket.io";

class FeedbackHandler {
	handleProvideFeedback(
		socket: Socket,
		item: any,
		callback: (response: { message: string }) => void
	) {
		//todo
	}
}
export default new FeedbackHandler();
