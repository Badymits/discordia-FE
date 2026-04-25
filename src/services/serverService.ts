import { http } from "./httpSetup";
import type { 
  CreateCategoryPayload, 
  CreateChannelPayload, 
  CreateServer,
} from "../types/ServerTypes";



// ====== POST METHODS =======

export const updateUser = async(userData: FormData, userId: string) => {
  return http.post(`/users/update/${userId}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
} 

export const createServer = async ({serverOwner, serverName, userId}: CreateServer) => {
  return http.post('/server/create-server', {serverOwner, serverName, userId})
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

export const getServer = async(serverId: string) => {
  return http.get(`/server/${serverId}`)
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