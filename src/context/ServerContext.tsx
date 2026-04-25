/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { 
  serverMembers as serverMembersData, 
  serverTwoMembers, 
} from "../utils/DummyData";
import type { Category, Server, ServerMembers } from "../types/ServerTypes";


interface ServerContextType {
  server: Server | null;
  setServer: React.Dispatch<React.SetStateAction<Server | null>>; // refers to current active server
  sampleUsers: ServerMembers[];
  getUser: (userTag: string) => ServerMembers; // return server member object
  servers: Server[];
  serverMembers: ServerMembers[];
  currentServerChannels: Category[];
  setServers: React.Dispatch<React.SetStateAction<Server[]>>;
  setServerMembers: React.Dispatch<React.SetStateAction<ServerMembers[]>>;
  setCurrentServerChannels: React.Dispatch<React.SetStateAction<Category[]>>;
}

interface ServerContextProps{
  children: React.ReactNode
}

export const ServerContext = createContext<ServerContextType | null>(null);


export const ServerProvider = (
  {
    children
  }: ServerContextProps) => {
  
  // holds details of the server that the user is viewing
  const [server, setServer] = useState<Server | null>(null)

  const sampleUsers: ServerMembers[] = [
    ...serverMembersData, 
    ...serverTwoMembers,
    {
      id: 33,
      user: "that333",
      userTag: "Im3",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=15",
      dateJoined: "18 Jul 2024",
    },
    {
      id: 67,
      user: "sixorSEVEEEEEN",
      userTag: "67676767",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=67",
      dateJoined: "18 Jul 2024",
    },
    {
      id: 29,
      user: "oldSchool baby",
      userTag: "you_know_what",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=27",
      dateJoined: "18 Jul 2024",
    },
    {
      id: 49,
      user: "Terry Crews",
      userTag: "D_Latrell",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=47",
      dateJoined: "18 Jul 2024",
    },
    {
      id: 123,
      user: "John Doe",
      userTag: "JohnDoe",
      status: "online",
      avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Ryan",
      dateJoined: "18 Jul 2024",
      bio: `Devz 4 lyf`,
      active: true,
      nowPlaying: "Valorant",
      hoursPlayed: 100,
      inGame: true,
      addedFriend: true
    },
    {
      id: 124,
      user: "Jiminy Doe",
      userTag: "The_J_Doe",
      status: "away",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Jd",
      dateJoined: "18 Jul 2024",
      bio: `I like turtles`,
      active: true,
      nowPlaying: "League of Legends",
      hoursPlayed: 100,
      inGame: false,
      addedFriend: true
    },
    {
      id: 125,
      user: "Jimmy Doe",
      userTag: "Jimmy_Doe",
      status: "idle",
      avatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Emery",
      dateJoined: "18 Jul 2024",
      bio: `I like turtles too`,
      active: true,
      nowPlaying: "Dota 2",
      hoursPlayed: 100,
      inGame: false,
      addedFriend: true
    },
    {
      id: 126,
      user: "Jane Doe",
      userTag: "Jane_Doe_123",
      status: "offline",
      bio: `I like turtles too but I also like dogs`,
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Leah",
      dateJoined: "18 Jul 2024",
      active: false,
      nowPlaying: "Apex Legends",
      hoursPlayed: 100,
      inGame: true,
      addedFriend: false
    },
    {
      id: 127,
      user: "Joanna Doe",
      userTag: "DoeDoe_Joanna",
      status: "offline",
      bio: `I like turtles too but I also like cats`,
      avatar: "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Mason",
      dateJoined: "18 Jul 2024",
      active: false,
      nowPlaying: "Call of Duty",
      hoursPlayed: 100,
      inGame: true,
      addedFriend: true
    },
    {
      id:667,
      user: "Definitely Not Epstein",
      userTag: "Epstein DidntKillHimself",
      status: "online",
      bio: `I like children`,
      avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=Luis",
      dateJoined: "18 Jul 2024",
      active: true,
      nowPlaying: "My Island",
      hoursPlayed: 100,
      inGame: true,
      addedFriend: true
    }
  ]


  const serverListMemo = useMemo(() => 
      [
        {
          serverId: 1,
          serverName: "Home",
          description: "",
          members: 0,
          serverIcon: ""
        },
        {
          serverId: 2,
          serverName:"Server 1",
          description: "Descrition",
          members: 10
        },
        {
          serverId: 3,
          serverName:"Server 2",
          description: "Descrition",
          members: 10
        },
        {
          serverId: 4,
          serverName:"Server 3",
          description: "Descrition",
          members: 10
        },
    ], []) // Memoize the server list to prevent unnecessary re-renders
  

  // list of servers that the user has joined
  const [servers, setServers] = useState<Server[]>(
    () => {
      const storedServers = sessionStorage.getItem("servers")
      return storedServers ? JSON.parse(storedServers) as Server[] : []
    }
  )

  // holds the list of channels and categories that the server has
  const [currentServerChannels, setCurrentServerChannels] = useState<Category[]>(
    () => {
      const storedCurrentServer = sessionStorage.getItem("currentServerChannelList")
      console.log("stored current server channels: ", storedCurrentServer)
      return storedCurrentServer ? JSON.parse(storedCurrentServer) as Category[] : []
    }
  )

  // holds list of members that the server has
  const [serverMembers, setServermembers] = useState<ServerMembers[]>(
    () => {
      const storedCurrentServerMembers = sessionStorage.getItem("currentServerMembers")
      console.log("stored current server members: ", storedCurrentServerMembers)
      return storedCurrentServerMembers ? JSON.parse(storedCurrentServerMembers) as ServerMembers[] : []
    }
  )

  const getUser = (userTag: string) => {
    return sampleUsers.find(user => user.userTag === userTag) || sampleUsers[0]
  }

  const serverContextData = {
    server: server,
    serverMembers: serverMembers,
    setServerMembers: setServermembers,
    setServer: setServer,
    sampleUsers: sampleUsers,
    getUser: getUser,
    serverList: serverListMemo,
    servers: servers,
    setServers: setServers,
    currentServerChannels: currentServerChannels,
    setCurrentServerChannels: setCurrentServerChannels,
  } 

  return <ServerContext.Provider value={serverContextData}>
    {children}
  </ServerContext.Provider>
};

export const useServerContext = () => {
  const context = useContext(ServerContext);

  // safety check that throws an error if the context is accessed outside its Provider
  if (!context) {
    throw new Error("useServerContext must be used within a ServerProvider");
  }

  // Dahil dumaan sa 'if', alam na ni TS na hindi ito null.
  return context as ServerContextType; 
};


