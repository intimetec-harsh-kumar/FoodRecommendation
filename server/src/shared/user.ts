export default class User {
	private static userDetails: Map<string, string> = new Map();

	static setLoggedInUserEmail(socketId: string, email: string) {
		try {
			User.userDetails.set(socketId, email);
		} catch (error) {
			throw error;
		}
	}

	static getLoggedInUserEmail(socketId: string): string | undefined {
		try {
			return User.userDetails.get(socketId);
		} catch (error) {
			throw error;
		}
	}

	static clearLoggedInUserEmail(socketId: string) {
		try {
			User.userDetails.delete(socketId);
		} catch (error) {
			throw error;
		}
	}
}
