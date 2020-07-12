import { Message } from './message';

export interface UserRoom {
  created?: Date;
  id: string;
  displayName: string;
  lastMessage: Message;
  messages: Message[];
}
