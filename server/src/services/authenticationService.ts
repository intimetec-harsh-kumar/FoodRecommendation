import RoleService from "./roleService";

class AuthenticationService {
	async authenticateUser(email: string): Promise<any[]> {
		try {
			const user = await RoleService.getRoleUser(email);
			console.log(user);

			return user;
		} catch (error: any) {
			throw error;
		}
	}
}

export default new AuthenticationService();
