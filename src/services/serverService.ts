import { http } from "./httpSetup";
import type { 
  CreateCategoryPayload, 
  CreateChannelPayload,
  UpdateChannelPayload, 
} from "../types/ServerTypes";
import type { ServerUser } from "../types/User";



// ====== POST METHODS =======

export const updateUser = async(userData: FormData, userId: string) => {
  return http.post(`/users/update/${userId}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
} 

export const updateServer = async(serverData: FormData, serverId: string) => {
  return http.post(`/server/update-server/${serverId}`, serverData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

export const updateChannel = async(channelData: UpdateChannelPayload, channelId: string, serverId: string) => {
  return http.post(`/channels/update/${channelId}?serverId=${serverId}`, channelData)
}

export const updateCategory = async(categoryName: string, categoryId: string, serverId: string) => {
  return http.post(`/category/update/${categoryId}?serverId=${serverId}`, categoryName)
}

export const createServer = async (serverData: FormData) => {
  return http.post('/server/create-server', serverData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

export const createChannel = async ({categoryId, channelName, icon, serverId}: CreateChannelPayload) => {
  return http.post(`/channels/create-channel?serverId=${serverId}`, {categoryId, channelName, icon})
}

export const createCategory = async({serverId, categoryName}: CreateCategoryPayload) => {
  return http.post('/category/create-category', {serverId, categoryName})
}

export const uploadImage = async(formData: FormData, messageId: string, messageType: string) => {

  if (messageType === "server"){
    return http.post(`/server-messages/upload-image/${messageId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(res => res.data)

  } else if (messageType === "direct"){
    return http.post(`/direct-messages/upload-image/${messageId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then(res => res.data)
  }
}

export const createDirectChannel = async(participants: ServerUser[], userId: string) => {
  return http.post(`/direct-channel/create-direct-channel`, {
    directChannelParticipants: participants,
    userId: userId
  })
}
// =========================


// ====== PATCH METHODS ======

export const updateMessage = async(
  channelId: string,
  messageId: string, 
  message:string,
  messageType: string
) => {

  let updateUrl = "";

  if (messageType === "server"){
    updateUrl = `/server-messages/update-server-message/${messageId}?channelId=${channelId}`
  } else if (messageType === "direct"){
    updateUrl = `/direct-messages/update-direct-message/${messageId}`
  }

  return http.patch(updateUrl, message,
    {
      headers: {
        "Content-Type": "text/plain"
      }
    }
  ).then(res => res.data)
}

export const updateReadMessages = async (directChannelId: string) => {
  return http.patch(`/direct-channel/update-read-messages/${directChannelId}`)
}

// =========================

// ====== GET METHODS ======

export const getUser = async(userId: string) => {
  return http.get(`/users/${userId}`)
}

export const getUsers = async(searchTerm: string, userId: string) => {
  return http.get(`/users/search-users`, {
    params: {
      searchTerm: searchTerm,
      userId: userId
    }
  })
}

export const getServer = async(serverId: string) => {
  return http.get(`/server/${serverId}`)
}

export const getServerCode = async(serverId: string) => {
  return http.get(`/server/get-server-code/${serverId}`)
}

export const getServersByUserId = async(userId: string | number) => {
  return http.get(`/server/list/${userId}`)
}

export const getServerMetaData = async(serverId: string) => {
  return http.get(`/server/get-metadata/${serverId}`)
}

export const getChannelById = async(channelId: string) => {
  return http.get(`/channels/${channelId}`)
}

export const getServerMessagesByChannelId = async(channelId: string | number) => {
  return http.get(`/server-messages/${channelId}`)
}

export const getDirectChannels = async (userId: string) => {
  return http.get(`/direct-channel/get-direct-channels/${userId}`)
}

export const getDirectChannel = async(directChannelId: string) => {
  return http.get(`/direct-channel/get-direct-channel/${directChannelId}`)
}

export const getDirectMessages = async(directChannelId: string) => {
  return http.get(`/direct-messages/get-direct-messages/${directChannelId}`)
}

// =========================


// ====== DELETE METHODS ======

export const deleteChannel = async(channelId: string, serverId: string) => {
  return http.delete(`/channels/${channelId}?serverId=${serverId}`)
}

export const deleteCategory = async(categoryId: string, serverId: string) => {
  return http.delete(`/category/${categoryId}?serverId=${serverId}`)
}

export const deleteServerMessage = async(channelId:string, messageId: string, serverId: string) => {
  return http.delete(`/server-messages/${serverId}/${channelId}/${messageId}`)
}

export const deleteDirectMessage = async(directChannelId: string, messageId: string) => {
  return http.delete(`/direct-messages/${directChannelId}/${messageId}`)
}

// ============================