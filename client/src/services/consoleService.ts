class ConsoleService {
	static displayMessage(message: string) {
		console.log(message);
	}

	static displayTable(data: any) {
		console.table(data);
	}
}

export default ConsoleService;
