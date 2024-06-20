import { io, Socket } from "socket.io-client";
import InputHandlerService from "./inputHandlerService";
import AuthenticationService from "./authenticationService";
import AdminConsole from "../console/adminConsole";
import EmployeeConsole from "../console/employeeConsole";
import ChefConsole from "../console/chefConsole";

class SocketService {
	private socket: Socket;
	private authenticationService: AuthenticationService;
	private adminConsole?: AdminConsole;
	private chefConsole?: ChefConsole;
	private employeeConsole?: EmployeeConsole;
	private messageCallback?: (msg: string) => void;
	private viewItemsCallback?: (items: any[]) => void;
	private viewMealTypesCallback?: (mealTypes: any[]) => void;

	constructor() {
		this.socket = io("http://localhost:3000");
		this.authenticationService = new AuthenticationService(this.socket);
		this.initializeSocket();
	}

	private initializeSocket(): void {
		this.socket.on("connect", this.handleConnect.bind(this));
		this.socket.on("authenticated", this.handleAuthenticated.bind(this));
		this.socket.on("disconnect", this.handleDisconnect.bind(this));
	}

	private async handleConnect(): Promise<void> {
		console.log("Connected to server");
		await this.authenticationService.authenticate();
	}

	private async handleAuthenticated(user: any[]): Promise<void> {
		if (user.length > 0) {
			console.log(
				`Email authenticated successfully. Role: ${user[0].role_name}`
			);
			switch (user[0].role_name) {
				case "admin":
					this.adminConsole = new AdminConsole(this);
					await this.adminConsole.start();
					break;
				case "employee":
					this.employeeConsole = new EmployeeConsole(this);
					await this.employeeConsole.start();
					break;
				case "chef":
					this.chefConsole = new ChefConsole(this);
					await this.chefConsole.start();
					break;
				default:
					console.error("Unknown role");
			}
		} else {
			console.log("Email authentication failed. Please try again.");
			await this.authenticationService.authenticate();
		}
	}

	private handleDisconnect(): void {
		console.log("Disconnected from server");
		InputHandlerService.close();
	}

	public emit(event: string, data?: any): void {
		this.socket.emit(event, data);
	}

	public getSocket(): Socket {
		return this.socket;
	}
}

export default SocketService;
