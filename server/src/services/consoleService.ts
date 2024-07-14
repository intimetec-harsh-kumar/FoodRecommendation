class ConsoleService {
	static displayMessage(message: string): void {
		console.log(message);
	}

	static displayTable(data: any): void {
		console.table(data);
	}
}

export default ConsoleService;
