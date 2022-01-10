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
  async handleStart(sender: Socket, room: string): Promise<void> {
    sender.broadcast.to(room).emit('timerStarted', sender.id);
  }

  @SubscribeMessage('resumeTimer')
  handleResume(client: Socket, room: string): void {
    client.broadcast.to(room).emit('timerResumed', client.id);
  }

  @SubscribeMessage('resetTimer')
  handleReset(client: Socket, room: string): void {
    client.broadcast.to(room).emit('timerReseted', client.id);
  }

  @SubscribeMessage('pauseTimer')
  handlePause(client: Socket, room: string): void {
    client.broadcast.to(room).emit('timerPaused', client.id);
  }

  @SubscribeMessage('sync')
  syncMessage(client: Socket, data: string): void {
    client.broadcast.emit('syncing', data);
  }

  @SubscribeMessage('createRoom')
  createRoom(client: Socket, room: string): void {
    client.emit('roomCreated', room);
    client.join(room);
    client.emit('roomJoined', room);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('roomJoined', room);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('roomLeaved', room);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`);
  }
}
