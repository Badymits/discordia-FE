

export interface User{
  userId: string;
  Firstname: string;
  Lastname: string;
  displayName?: string;
  username: string;
  email: string;
  imgUrl?: string;
  userTag?: string;
  bio?: string;
}

export interface ServerUser{
  userId: string;
  username: string;
  displayName: string;
  userBio?: string;
  imgUrl: string;
}


export interface UserPayload{
  userId: string;
  displayName: string;
  username: string;
  userBio: string;
  email: string;
  imgUrl: string | File;
}

export interface RegisterForm {
    firstname: string;
    lastname: string;
    email: string
    username: string;
    displayName: string;
    password: string
    confirmPassword?: string
}