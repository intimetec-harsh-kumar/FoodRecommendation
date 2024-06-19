import { Socket } from 'socket.io-client';
import InputHandlerService from './inputHandlerService';

class AuthenticationService {
  constructor(private socket: Socket) {}

  async authenticate(): Promise<void> {
    try {
      const email = await InputHandlerService.askQuestion('Please enter your email: ');
      this.socket.emit('authenticate', email);
    } catch (err) {
      console.error('Error during authentication input:', err);
    }
  }
}

export default AuthenticationService;
