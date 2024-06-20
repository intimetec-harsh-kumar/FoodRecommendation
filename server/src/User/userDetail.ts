export default class UserDetail {
	static userDetail: string | null;

	static setUserDetail(userDetail: string) {
		console.log("userDetail", userDetail);

		UserDetail.userDetail = userDetail;
	}

	static getUserDetail(): string | null {
		return UserDetail.userDetail;
	}

	static clearUserDetail() {
		UserDetail.userDetail = null;
	}
}
