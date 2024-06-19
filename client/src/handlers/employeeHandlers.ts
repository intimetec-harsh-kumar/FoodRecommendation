import { Socket } from 'socket.io-client';
import ActionHandlers from '../handlers/actionHandlers';
import InputHandlerService from '../services/inputHandlerService';

class EmployeeHandlers extends ActionHandlers {
  constructor(socket: Socket) {
    super(socket);
  }

  async viewAvailableItems() {
    this.socket.emit('viewItems');
  }

  async placeOrder() {
    const itemId = parseInt(await InputHandlerService.askQuestion('Enter item ID to order: '));
    this.socket.emit('placeOrder', { itemId });
  }
}

export default EmployeeHandlers;
