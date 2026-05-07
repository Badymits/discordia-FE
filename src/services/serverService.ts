import { http } from "./httpSetup";
import type { 
  CreateCategoryPayload, 
  CreateChannelPayload,
  UpdateChannelPayload, 
} from "../types/ServerTypes";



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

export const updateChannel = async(channelData: UpdateChannelPayload, channelId: string) => {
  return http.post(`/channels/update/${channelId}`, channelData)
}

export const updateCategory = async(categoryName: string, categoryId: string) => {
  return http.post(`/category/update/${categoryId}`, categoryName)
}

export const createServer = async (serverData: FormData) => {
  return http.post('/server/create-server', serverData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

export const createChannel = async ({categoryId, channelName, icon}: CreateChannelPayload) => {
  return http.post('/channels/create-channel', {categoryId, channelName, icon})
}

export const createCategory = async({serverId, categoryName}: CreateCategoryPayload) => {
  return http.post('/category/create-category', {serverId, categoryName})
}

export const uploadImage = async(formData: FormData, messageId: string) => {
  return http.post(`/messages/upload-image/${messageId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then(res => res.data)
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

export const getString = async() => {
  return http.get(`/server/get-string`)
}

export const getServersByUserId = async(userId: string | number) => {
  return http.get(`/server/list/${userId}`)
}

export const getChannelById = async(channelId: string) => {
  return http.get(`/channels/${channelId}`)
}

export const getMessagesByChannelId = async(channelId: string | number) => {
  return http.get(`/messages/${channelId}`)
}

// =========================


// ====== DELETE METHODS ======

export const deleteChannel = async(channelId: string) => {
  return http.delete(`/channels/${channelId}`)
}

export const deleteCategory = async(categoryId: string) => {
  return http.delete(`/category/${categoryId}`)
}

// ============================