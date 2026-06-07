import { queryOptions } from "@tanstack/react-query";
import { 
  getChannelById,
  getServerMessagesByChannelId,
  getServer,
  getServerCode,
  getServersByUserId, 
  getUser,
  getUsers,
  getDirectChannels,
  getDirectChannel,
  getDirectMessages
} from "../services/serverService";

export const fetchUser = (userId: string) => {
	return queryOptions({
		queryKey: ["user", userId],
		queryFn: () => getUser(userId)
	})
}

export const fetchUsers = (searchTerm: string, userId: string) => {
	return queryOptions({
		queryKey: ["searchedUsers"],
		queryFn: () => getUsers(searchTerm, userId)
	})
}

export const fetchDirectChannels = (userId: string) => {
	return queryOptions({
		queryKey: ["directChannels", userId],
		queryFn: () => getDirectChannels(userId)
	})
}

export const fetchDirectChannel = (directChannelId: string) => {
	return queryOptions({
		queryKey: ["directChannelData", directChannelId],
		queryFn: () => getDirectChannel(directChannelId)
	})
}

export const fetchDirectMessages = (directChannelId: string) => {
	return queryOptions({
		queryKey: ["directChannelMessages", directChannelId],
		queryFn: () => getDirectMessages(directChannelId).then(res => res.data)
	})
}


export const fetchServersList = (userId: string) => {
	return queryOptions({
		queryKey: ["servers", userId],
		queryFn: () => getServersByUserId(userId),
	})
}

export const fetchServer = (serverId: string) => {
	return queryOptions({
		queryKey: ["serverChannels", serverId],
		queryFn: () => getServer(serverId).then(res => res.data)
	})
}

export const fetchServerCode = (serverId: string) => {
	return queryOptions({
		queryKey: ["serverCode", serverId],
		queryFn: () => getServerCode(serverId)
	})
}

export const fetchChannel = (channelId: string) => {
	return queryOptions({
		queryKey: ["channel", channelId],
    queryFn: () => getChannelById(channelId).then(res => res.data)
	})
}

export const fetchMessages = (channelId: string) => {
  return queryOptions({
    queryKey: ["channelMessages", channelId],
    queryFn: () => getServerMessagesByChannelId(channelId)
    .then(res => res.data) 
  })
}

