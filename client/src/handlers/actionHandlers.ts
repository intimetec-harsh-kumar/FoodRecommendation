import { Socket } from 'socket.io-client';

class ActionHandlers {
  constructor(public socket: Socket) {}

  handleMessage(msg: string): void {
    console.log(`Server: ${msg}`);
  }

  handleViewItemsResponse(items: any[]): void {
    console.log('Items:', items);
  }

  handleViewMealTypesResponse(mealTypes: any[]): void {
    console.log('Meal Typesss:', mealTypes);
  }
}

export default ActionHandlers;
