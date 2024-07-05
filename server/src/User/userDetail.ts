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
