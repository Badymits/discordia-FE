import type { UUIDTypes } from "uuid";
import type { User } from "./User";

export interface Server {
  serverId: number | string;
  serverName: string;
  serverOwner?: User
  description: string;
  members: number; // will be removed lmao
  serverIcon?: string;
  isAddButton?: boolean
  categories?: Category[]
  serverMembers?: ServerMembers[]
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
  channelRoles?: any[]
}

export interface Category {
  serverId?: string; // shoould switch to required, for the mean time, set it to optional
  serverName?: string;
  categoryId?: string;
  categoryName: string;
  categoryChannels: Channel[]
}

export interface ServerMembers {
  id: string;
  user: string;
  userName: string;
  displayName: string;
  userTag: string;
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



export interface Message {
  serverId: string;
  messageId?: string;
  channelId: string;
  userId: string;

  userAvatar?: string; // receives url string
  displayName: string;

  message: string;
  messageImgUrl?: string;
  dateTimestamp?: string; // data type is converted in the backend
  messageTag?: MessageTag;

  isReply?: boolean;
  isContentWithImg?: boolean;
}

export interface MessageTag { 
  user: ServerMembers;
  role: string;
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
}

export interface CreateCategoryPayload {
  serverId: string;
  categoryName: string;
}