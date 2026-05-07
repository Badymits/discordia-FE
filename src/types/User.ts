

export interface User{
  UserId: string;
  Firstname: string;
  Lastname: string;
  displayName?: string;
  username: string;
  Password?: string;
  email: string;
  imgUrl?: string;
  userTag?: string;
  bio?: string;
}

export interface ServerUser{
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  imgUrl: string;
}


export interface UserPayload{
  UserId: string;
  displayName: string;
  userName: string;
  userBio: string;
  email: string;
  imgUrl: string | File;
}