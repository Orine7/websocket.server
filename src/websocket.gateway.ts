import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PlayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('PlayerGateway');

  @SubscribeMessage('startTimer')
  async handleStart(sender: Socket): Promise<void> {
    sender.broadcast.emit('timerStarted', sender.id);
  }

  @SubscribeMessage('resumeTimer')
  handleResume(client: Socket): void {
    client.broadcast.emit('timerResumed', client.id);
  }

  @SubscribeMessage('resetTimer')
  handleReset(client: Socket): void {
    client.broadcast.emit('timerReseted', client.id);
  }

  @SubscribeMessage('pauseTimer')
  handlePause(client: Socket): void {
    client.broadcast.emit('timerPaused', client.id);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`);
  }
}
