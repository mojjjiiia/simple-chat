import { Injectable } from '@nestjs/common';
import { IMessage } from './interfaces/message';

@Injectable()
export class ChatService {
    private online = 0;
    private users = new Map<string, IUser>();
    private messages: Array<IMessage> = [];

    getOnline(): Number {
        return this.online;
    }

    getUsers(): Map<string, IUser> {
        return this.users;
    }

    connectUser(user: IUser) {
        this.users.set(user.id, user);
        return this.online++;
    }

    disconnectUser(id: string) {
        return this.online--;
    }

    getMessages() {
        return this.messages;
    }

    addMessage(message: IMessage) {
        this.messages.push(message);
        return this.messages;
    }
}
