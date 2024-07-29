import { Socket } from "socket.io";
import UserService from "../services/userService";
import ConsoleService from "../services/consoleService";

class UserHandler {
	public async handleUpdateProfile(
		socket: Socket,
		profileData: any,
		callback: (response: { message: string; error?: string }) => void
	) {
		try {
			const isProfileUpdated = await UserService.updateProfile(
				socket,
				profileData
			);
			if (isProfileUpdated) {
				ConsoleService.displayMessage(`profile updated successfully`);
				callback({
					message: `profile updated  successfully`,
				});
			} else {
				ConsoleService.displayMessage(`Failed to update profile`);
				callback({
					message: `Failed to update profile`,
				});
			}
		} catch (error: any) {
			console.error("Error occured:", error.message);
			callback({
				message: "An error occurred while updating profile",
				error: `Error occured: ${error.message}`,
			});
		}
	}
}
export default new UserHandler();
