export default class UserDetail {
	private static userDetails: Map<string, string> = new Map();

	static setUserDetail(socketId: string, userDetail: string) {
		try {
			UserDetail.userDetails.set(socketId, userDetail);
		} catch (error) {
			throw error;
		}
	}

	static getUserDetail(socketId: string): string | undefined {
		try {
			return UserDetail.userDetails.get(socketId);
		} catch (error) {
			throw error;
		}
	}

	static clearUserDetail(socketId: string) {
		try {
			UserDetail.userDetails.delete(socketId);
		} catch (error) {
			throw error;
		}
	}

	static clearAllUserDetails() {
		try {
			UserDetail.userDetails.clear();
		} catch (error) {
			throw error;
		}
	}
}
