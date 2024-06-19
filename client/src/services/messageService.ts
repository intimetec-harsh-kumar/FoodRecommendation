import { Socket } from 'socket.io-client';
import InputHandlerService from './inputHandlerService';

class MessageService {
  constructor(private socket: Socket) {}

  async sendMessage(): Promise<void> {
    try {
      const message = await InputHandlerService.askQuestion('Enter a message to send to the server: ');
      this.socket.emit('message', message);
      InputHandlerService.close(); 
    } catch (err) {
      console.error('Error during message input: ', err);
    }
  }
}

export default MessageService;

