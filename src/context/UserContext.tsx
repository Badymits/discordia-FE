/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, useState} from "react";
import type { User } from "../types/User";
//import { useNavigate, useLocation } from "react-router-dom";


interface UserContextType{
  user: User | null,
  isInVoice: boolean;
  joinedVoiceChannel: ActiveVoiceChannel;
  setIsInVoice: React.Dispatch<React.SetStateAction<boolean>>;
  setJoinedVoiceChannel: React.Dispatch<React.SetStateAction<ActiveVoiceChannel>>
}

interface ActiveVoiceChannel {
  channelName: string
  channelId: string | number;
  serverName: string;
}

const UserContext = createContext<UserContextType | null>(null);

interface ProviderProps {
  children: React.ReactNode;
};

export default function UserContextProvider(
  {
  children
  }: ProviderProps){

  const [isInVoice, setIsInVoice] = useState<boolean>(false)
  const [joinedVoiceChannel, setJoinedVoiceChannel] = useState<ActiveVoiceChannel>({
    channelId: "",
    channelName: "",
    serverName: ""
  })

  const getInitialUser = (): User | null => {
    const userObj = sessionStorage.getItem("UserObj");

    if (userObj) {
      try {
        const parsedObj = JSON.parse(userObj);
        return {
          Firstname: parsedObj.firstName,
          Lastname: parsedObj.lastName,
          username: parsedObj.username,
          displayName: parsedObj.displayname,
          email: parsedObj.email,
          UserId: parsedObj.userId
          
        };
      } catch (err) {
        console.log(err);
      }
    }

    //try to return null here
    return null;
  };

  const [user, setUser] = useState<User | null>(
    getInitialUser()
  );

  const userContextData = {
    user: user,
    isInVoice: isInVoice,
    joinedVoiceChannel: joinedVoiceChannel,
    setIsInVoice: setIsInVoice,
    setJoinedVoiceChannel: setJoinedVoiceChannel
  }


  return <UserContext.Provider value={userContextData}>
      {children}
    </UserContext.Provider>
  
}

// provide a custom hook to use the context, where an error is thrown if the context is not provided
// eslint-disable-next-line react-refresh/only-export-components
export const useCurrentUser = () => {
  const currentUserContext = useContext(UserContext);

  // printing a clear error message in the console when a provider is not wrapping the components properly. 
  if (currentUserContext === undefined){
    throw new Error("useUserContext must be used within a UserContextProvider")
  }

  return currentUserContext as UserContextType;
}



