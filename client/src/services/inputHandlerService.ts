import readline from "readline";
import ConsoleService from "./consoleService";

class InputHandlerService {
	private rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	askQuestion(query: string): Promise<string> {
		return new Promise((resolve) => {
			this.rl.question(query, (answer) => {
				resolve(answer);
			});
		});
	}

	async askYesNoQuestion(question: string): Promise<boolean> {
		let response: string;
		while (true) {
			response = await this.askQuestion(question);
			if (response.toLowerCase() === "yes") {
				return true;
			} else if (response.toLowerCase() === "no") {
				return false;
			} else {
				ConsoleService.displayMessage(
					"Invalid input. Please enter 'yes' or 'no'."
				);
			}
		}
	}

	close(): void {
		this.rl.close();
	}
}

export default new InputHandlerService();
