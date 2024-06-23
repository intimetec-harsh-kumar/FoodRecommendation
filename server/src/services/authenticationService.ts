import RoleService from "./roleService";

class AuthenticationService {
	async authenticateUser(email: string): Promise<any[]> {
		try {
			const user = await RoleService.getRoleUser(email);
			return user;
		} catch (err) {
			console.error("Authentication error:", err);
			return [];
		}
	}
}

export default new AuthenticationService();
