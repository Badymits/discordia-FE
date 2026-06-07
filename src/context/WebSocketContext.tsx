/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState} from "react";
import { useWebSocketService, type NotificationCallback, type SubscriptionCallback } from "../services/webSocketService";
import { useCurrentUser } from "./UserContext";
import type { Message } from "../types/ServerTypes";

interface WebSocketContextType {
  send: (destination: string, body: Message) => void;
  connect: () => void;
  subscribe: (destination: string, callback: SubscriptionCallback | NotificationCallback) => void;
  unsubscribe: (destination: string) => void;
  disconnect: () => void;
  isConnected: React.RefObject<boolean>;
  setActiveRoom: React.Dispatch<React.SetStateAction<{roomId: string, roomType: "server" | "direct"} | null>>;
  socketConnection: boolean
}

interface WebSocketContextProps{
  children: React.ReactNode
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({children}: WebSocketContextProps) => {

  const { user } = useCurrentUser();

  const [socketConnection, setSocketConnection] = useState<boolean>(false)
  const [activeRoom, setActiveRoom] = useState<{roomId: string, roomType: "server" | "direct"} | null>(null)
  
  const webSocketUrl = 'http://localhost:8091/ws';
  const {
    connect,
    send,
    disconnect,
    subscribe,
    unsubscribe,
    isConnected
  } = useWebSocketService(
    webSocketUrl,
    () => {
      console.log("Connection Successful! happy chatting!")
      setSocketConnection(true)
    },
    (error) => {
      console.error("Websocket error: ", error)
      setSocketConnection(false)
    }
  )

  const queryKeyRef = useRef<string>(null)
  queryKeyRef.current = activeRoom?.roomType === "server" ? "channelMessages" : "directChannelMessages"

  const queryIdRef = useRef<string>(null)
  queryIdRef.current = activeRoom?.roomId || ""
  
  useEffect(() => {
    if (!user){
      console.log("User is offline")
      return;
    }

    console.log("User is now online!")

    connect();
    //setSocketConnection(true)

    return () => {
      disconnect();
      setSocketConnection(false)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const data = {
    send: send,
    connect: connect,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    disconnect: disconnect,
    isConnected: isConnected,
    setActiveRoom: setActiveRoom,
    socketConnection: socketConnection
  }

  return <WebSocketContext.Provider value={data}>
    {children}
  </WebSocketContext.Provider>
}

export const useWebSocketContext = () => {

  const context = useContext(WebSocketContext)

  if (!context) {
    throw new Error("useWebSocketContext must be used within a ServerProvider");
  }

  return context as WebSocketContextType

}
