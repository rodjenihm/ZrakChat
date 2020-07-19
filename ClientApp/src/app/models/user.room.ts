import { Message } from './message';
import { VUser } from './v.user';

export interface UserRoom {
  created?: Date;
  id: string;
  displayName: string;
  lastMessage: Message;
  messages: Message[];
  members: VUser[];
  newMessages?: boolean;
}
