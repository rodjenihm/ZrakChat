export interface Message {
  sent?: Date;
  id: string;
  roomId: string;
  username: string;
  text: string;
}