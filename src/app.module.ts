import { Module } from '@nestjs/common';
import { PlayerGateway } from './websocket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [PlayerGateway],
})
export class AppModule {}
