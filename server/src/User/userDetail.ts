/*
export default class UserDetail {
	static userDetail: string | undefined;

	static setUserDetail(userDetail: string) {
		try {
			UserDetail.userDetail = userDetail;
		} catch (error) {
			throw error;
		}
	}

	static getUserDetail(): string | undefined {
		try {
			return UserDetail.userDetail;
		} catch (error) {
			throw error;
		}
	}

	static clearUserDetail() {
		try {
			UserDetail.userDetail = undefined;
		} catch (error) {
			throw error;
		}
	}
}
*/
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
