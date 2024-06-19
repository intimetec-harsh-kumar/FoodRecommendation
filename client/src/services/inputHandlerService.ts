import readline from 'readline';

class InputHandlerService {
  private rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, (answer) => {
        resolve(answer);
      });
    });
  }

  close(): void {
    this.rl.close();
  }
}

export default new InputHandlerService();

