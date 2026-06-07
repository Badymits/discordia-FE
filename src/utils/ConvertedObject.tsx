import type { Channel, ConversationContext } from "../types/ServerTypes";
import type { ServerUser } from "../types/User";


// takes in two types (ServerPage and Direct will call MessagesComponent)
// this then takes in the Channel OR the Recipient (Person that was DM'ed) details to display
export const convertObj = (object: Channel | ServerUser, type: "server" | "direct") => {

  if (object === null){
    return {} as ConversationContext;
  }

  let convertedObj;

  if (type === "server"){
    
    convertedObj = {
      conversationName: (object as Channel).channelName || "",
      conversationTopic: (object as Channel).channelTopic || "",
      icon: (object as Channel).icon
    } 
    return convertedObj;

  } else {
    convertedObj = {
      conversationName: (object as ServerUser).displayName || "",
      userAliases: (object as ServerUser).username || "",
      userAvatar: (object as ServerUser).imgUrl || ""
    }
    return convertedObj
  }
}