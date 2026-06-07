import type { UUIDTypes } from "uuid";
import type { ServerUser, User } from "./User";

export interface Server {
  serverId: number | string;
  serverName: string;
  serverOwner?: User;
  serverInviteCode?: string;
  createdDate?: string;
  description?: string;
  members?: number; // will be removed lmao
  serverMemberCount?: number;
  serverIcon?: string;
  isAddButton?: boolean
  serverMembers?: ServerMembers[]
  serverCategories?: Category[];
}

export interface CreateServer{
  serverOwner: string;
  serverName: string;
  serverIcon?: string;
  userId: string | UUIDTypes;
}


export interface CreateChannel{
  channelName: string;
  categoryName: string;
  serverMembers?: []
}


export interface Channel{
  channelId: string;
  categoryId?: string;
  serverId?: number; // in DB, make this the lookup for foreign key, can be serverName but pref ID
  serverName?: string;
  channelName: string;
  icon: React.ReactNode | string; 
  isPrivate? :boolean;
  isNSFW?: boolean;
  channelType?: string;
  channelMembers?: ServerMembers[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  channelRoles?: any[];
  channelTopic?: string;
}

export interface Category {
  serverId?: string; // shoould switch to required, for the mean time, set it to optional
  serverName?: string;
  categoryId?: string;
  categoryName: string;
  categoryChannels: Channel[];
  isRootFolder: boolean;
}

export interface ServerMembers {
  memberId: string;

  user?: User;

  username: string;
  displayName: string;
  serverNickname?: string;
  imgUrl?: string;

  userTag?: string;
  avatar?: string;
  bio?: string;
  active?: boolean;
  addedFriend?: boolean;

  status?: string;
  nowPlaying?: string;
  inGame?: boolean;
  hoursPlayed?: number;
  dateJoined?: string;
  serverMemberStatus?: ServerMemberStatus 
}

interface BaseMessageType {
  serverId: string | null;
  messageId?: string;
  type: string;
  userId: string;

  userAvatar?: string;
  displayName: string;

  message: string;
  repliedTo?: ReplyMessage;
  messageImgUrl?: string;
  dateTimestamp?: string;

  isReply: boolean;
  isContentWithImg: boolean;
  isEdited: boolean;
  isServerInvite: boolean;
}

export interface ServerMessage extends BaseMessageType {
  channelId: string;
  fileUrl?: string;
  messages?: string;
}

export interface DirectMessage extends BaseMessageType {
  directChannelId: string;
  recipientId: string;
}

export interface ReplyMessage {
  messageId: string;
  message: string;
  userId: string;
  displayName: string;
  imgUrl?: string;
  isContentWithImg: boolean
}

export interface MessageTag { 
  user: ServerMembers;
  role: string;
}

export type PayloadServerRawMessage = Partial<ServerMessage> & {
  repliedTo?: Partial<ReplyMessage>
}

export type PayloadDirectRawMessage = Partial<DirectMessage> & {
  repliedTo?: Partial<ReplyMessage>
}

export type PayloadRawMessage = Partial<ServerMessage | DirectMessage> & {
  repliedTo?: Partial<ReplyMessage>
}

export interface ConversationContext{
  conversationName: string;
  conversationTopic?: string;
  userAliases?: string;
  icon?: string | React.ReactNode;
  userAvatar?: string;
}

export interface DirectChannel {
  channelCreated: string;
  directChannelId: string;
  directChannelParticipants: ServerUser[]
}

export interface MessageFileState{
  id: string;
  fileName: string;
  objectURL: string;
  entity: File;
}

export interface ServerMemberStatus {
  userId: string;
  isInVoiceChannel?: boolean;
  isMuted?: boolean;
  isDeafened?: boolean;
  isTimedOut: boolean;
  timeOutStatus: string;
}

export interface ActiveVoiceChannel {
  channelName: string
  channelId: string | number;
  serverName: string;
}

export interface MediaFormData {
  image: File,
  serverId: string,
  channelId: string
}

export interface CreateChannelPayload {
  categoryId: string;
  channelName: string;
  icon?: string;
  channelType: string;
  serverId: string;
}

export interface CreateCategoryPayload {
  serverId: string;
  categoryName: string;
}

export interface UpdateChannelPayload{
  channelName: string;
  channelTopic: string;
}


export interface NotificationPayload {
  userId: string;
  directChannelId: string;
  displayName: string;
  userAvatar: string;
  unreadMessages?: number;
}