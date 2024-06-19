import RoleService from "./roleService";
import UserService from "./userService";

class AuthenticationService {
	async authenticateUser(email: string): Promise<any[]> {
		try {
			const user = await RoleService.getRoleUser(email);
			console.log("in authService", user);
			return user;
		} catch (err) {
			console.error("Authentication error:", err);
			return [];
		}
	}
}

export default new AuthenticationService();
