import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io'
import { IMessage } from './interfaces/message';

@WebSocketGateway({ cors: true })
export class ChatGateway {

  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const id = client.id;
    const nick = client.handshake.query.nickname;

    if (nick) {
      const user: IUser = { id: id, nickname: String(nick) }
      this.chatService.connectUser(user);
    }
  }

  handleDisconnect(client: Socket) {
    this.chatService.disconnectUser(client.id);
  }

  @SubscribeMessage('message:new')
  handleMessage(client: Socket, payload: IMessage) {
    this.chatService.addMessage(payload);
    this.emitAllMessages();
  }

  @SubscribeMessage('message:getAll')
  handleGetMessages(client: Socket): Array<IMessage> {
    return this.chatService.getMessages();
  }

  private emitAllMessages() {
    this.server.emit('message:all', this.chatService.getMessages());
  }
} 
