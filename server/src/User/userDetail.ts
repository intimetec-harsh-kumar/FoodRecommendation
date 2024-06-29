export default class UserDetail {
	static userDetail: string | null;

	static setUserDetail(userDetail: string) {
		try {
			UserDetail.userDetail = userDetail;
		} catch (error) {
			throw error;
		}
	}

	static getUserDetail(): string | null {
		try {
			return UserDetail.userDetail;
		} catch (error) {
			throw error;
		}
	}

	static clearUserDetail() {
		try {
			UserDetail.userDetail = null;
		} catch (error) {
			throw error;
		}
	}
}
