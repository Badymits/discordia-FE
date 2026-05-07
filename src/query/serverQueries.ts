import { queryOptions } from "@tanstack/react-query";
import { 
  getChannelById,
  getMessagesByChannelId,
  getServer,
  getServersByUserId, 
  getUser,
  getUsers
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

export const fetchChannel = (channelId: string) => {
	return queryOptions({
		queryKey: ["channel", channelId],
    queryFn: () => getChannelById(channelId).then(res => res.data)
	})
}

export const fetchMessages = (channelId: string) => {
  return queryOptions({
    queryKey: ["channelMessages", channelId],
    queryFn: () => getMessagesByChannelId(channelId)
    .then(res => res.data)
  })
}

