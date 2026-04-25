

export interface User{
  UserId: string;
  Firstname: string;
  Lastname: string;
  displayName?: string;
  userName: string;
  Password?: string;
  email: string;
  imgUrl?: string;
  userTag?: string;
  bio?: string;
}

export interface UserPayload{
  UserId: string;
  displayName: string;
  userName: string;
  userBio: string;
  email: string;
  imgUrl: string | File;
}