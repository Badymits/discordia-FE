/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from "react";
import { useWebSocketService, type SubscriptionCallback } from "../services/webSocketService";
import { useCurrentUser } from "./UserContext";
import type { Message } from "../types/ServerTypes";

interface WebSocketContextType {
  sample: string;
  send: (destination: string, body: Message) => void;
  subscribe: (destination: string, callback: SubscriptionCallback) => void;
  unsubscribe: (destination: string) => void;
  isConnected: React.RefObject<boolean>;
}

interface WebSocketContextProps{
  children: React.ReactNode
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({children}: WebSocketContextProps) => {

  const { user } = useCurrentUser();
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
    () => console.log("Connected!"),
    (error) => console.error("Websocket error: ", error)
  )

  useEffect(() => {
    if (!user){
      console.log("User is offline")
      return;
    }

    console.log("User is now online!")

    connect();

    return () => {
      disconnect();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const sample = ""

  const data = {
    sample: sample,
    send: send,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    isConnected: isConnected
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
