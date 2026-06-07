import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import { useServerContext } from '../context/ServerContext';

import type { NotificationPayload, Server } from '../types/ServerTypes';

import { fetchServersList } from '../query/serverQueries';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '../context/UserContext';
import ServerListLoader from './LoadingComponents/ServerListLoader';
import { useWebSocketContext } from '../context/WebSocketContext';

import { BiPlusCircle } from 'react-icons/bi'
import { BsDiscord } from 'react-icons/bs'
import { updateReadMessages } from '../services/serverService';


interface ServerListProps{
  serverList: Server[];
  handleFunction: () => void;
}

const ServerList = (
  { 
    //serverList,
    handleFunction
}: ServerListProps) => {

  const queryClient = useQueryClient();
  const { serverId, directChannelId} = useParams()
  const { user } = useCurrentUser()
  const {
    setServer
  } = useServerContext();

  const {
    subscribe,
    unsubscribe,
    socketConnection,
    isConnected
  } = useWebSocketContext();

  const navigate = useNavigate()

  //const [directMessageNotifs, setDirectMessagesNotifs] = useState<NotificationPayload[] | undefined>(undefined)

  console.log(user)

  const { data, isLoading } = useQuery({
    ... fetchServersList(user?.userId || ""),
    enabled: !!user?.userId, // Prevents fetching data until UserID has value
    staleTime: 1000 * 5 * 60,
    gcTime: 1000 * 5 * 60
  })

  const { 
    data: notifications, 
    isLoading: isNotificationLoading 
  } = useQuery<NotificationPayload[]>({
    queryKey: ["notifications-messages"],
    queryFn: () => {return []},
    enabled: !!socketConnection,
    staleTime: 1000 * 5 * 60,
    gcTime: 1000 * 5 * 60
  })

  const {
    mutate: updateReadMessagesMutate
  } = useMutation({
    mutationKey: ["updateReadMessages"],
    mutationFn: async (channelId: string) => await updateReadMessages(channelId || ""),

    onMutate: async (channelId) => {
      await queryClient.cancelQueries({queryKey: ["notifications-messages"]})

      const notifications = queryClient.getQueryData(["notifications-messages"])

      if (!notifications) return;

      queryClient.setQueryData(["notifications-messages"], (notifs: NotificationPayload[]) => {
        if (!notifs) return [];

        return notifs.filter(n => n.directChannelId !== channelId)
      })

      return { notifications, channelId }
    },

    onError: (error, _variables, context) => {
      console.error("Error: ", error);
      queryClient.setQueryData(["notifications-messages"], context?.notifications)
    },

    onSuccess: (response, _variables, context) => {

      if (!response){
        console.error("Data not found");
        return;
      }

      queryClient.setQueryData(["notifications-messages"], (notifs: NotificationPayload[]) => {
        if (!notifs) return [];

        return notifs.filter(n => n.directChannelId !== context?.channelId)
      })

      console.log(queryClient.getQueryData(["notifications-messages"]))
    }
  })

  const serverList: Server[] = data?.data || []

  console.log("testing server list: ", serverList)

  const setServerObject = (
    serverId: number | string,
    serverName: string, 
    randomAssBoboTS: number,
  ) => {

     setServer({
      serverId: serverId,
      serverName: serverName,
      members: 0,
      description: "",
      isAddButton: false
    })

    const urlParams = serverId ? serverId : randomAssBoboTS + 1

    return navigate(`/server/${serverName}/${urlParams}`)
  }

  const getInitials = (serverName: string) => {
    return serverName
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
  console.log(socketConnection , isConnected)

  const updateIsReadChannel = (channelId: string) => {
    console.log("Changing...")

    if (!channelId || !user){
      console.error("Channeld ID and/or User not found!")
      return;
    }

    console.log("Removing notification....")

    updateReadMessagesMutate(channelId)
  }


  useEffect(() => {

    // notification append will not run under these conditions
    if (!user || !isConnected || !socketConnection || !!directChannelId){
      return;
    }

    if (socketConnection && isConnected && !directChannelId){

      const timer = setTimeout(() => {
        subscribe(`/direct/${user.userId}`, (notificationPayload: NotificationPayload) => {
        console.log(notificationPayload)

        const userId = notificationPayload.userId
        const channelId = notificationPayload.directChannelId;

        if (!channelId|| !userId){
          console.error("User ID and/or DirectChannelId not detected!")
          return;
        }

        if (!notificationPayload) return;

        queryClient.setQueryData(["notifications-messages"], (notifs: NotificationPayload[]) => {
          if (notifs === null || notifs === undefined) return [];

          const targetedRoom = notifs.find(room => room.directChannelId === channelId)
        

          if (!targetedRoom) return [...notifs, notificationPayload]

          return notifs.map(
            n => n.directChannelId === channelId
            ? {...n, unreadMessages: notificationPayload.unreadMessages}
            : n
          )
        })
      })

      }, 100)
      
      return () => clearTimeout(timer)
    }

    return () => {
      if (socketConnection && isConnected){
        unsubscribe(`/direct/${user.userId}`)
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    subscribe, 
    unsubscribe,
    directChannelId,
    socketConnection,
    isConnected,
    user
  ])


  if (isLoading || isNotificationLoading) {
    return <ServerListLoader />
  }
    
  return (
    <div className='bg-[#111113] w-19.5 h-full px-2 shrink-0'>
    
      <div className='w-full flex flex-col items-center'> 
      
        {
          (notifications || []).map((notif: NotificationPayload, i) => (
            <Link
              to={`/messages/${notif?.directChannelId}`}
              key={i}
              onClick={() => updateIsReadChannel(notif.directChannelId)}
              data-tooltip-id="direct-message-notif"
              data-tooltip-content={notif?.displayName}
              className='relative'
            >
              {
                notif?.userAvatar 
                ? <img 
                    src={notif?.userAvatar}
                    alt={notif?.displayName}
                    className='h-11 w-11.5 rounded-md mt-3'
                  />
                : <BsDiscord 
                  className='mt-3 h-11 w-11.5 p-2 text-white
                    cursor-pointer rounded-xl bg-[#23272a] hover:bg-indigo-500'   
                  />
              }
              <p className='bg-red-500 text-white w-4 text-center 
                text-xs rounded-full absolute -bottom-1 -right-1 font-bold'>
                {notif.unreadMessages}
              </p>
              <Tooltip id='direct-message-notif' place='right' className='z-99'/>
              
            </Link>
          ))
        }
        {/* Home Btn */}
        <Link to="/" className='relative group' data-tooltip-id='direct-messages' data-tooltip-content="Direct Messages">
          <BsDiscord className={`
          text-4xl text-[#7289DA] my-3 h-11 w-11.5 p-2 
          cursor-pointer rounded-xl bg-[#23272a] hover:bg-indigo-500 hover:text-white
          ${!serverId && "bg-indigo-500 text-white"}
          `}
          />
          
          {/* UI to indicate where user is (in this case in direct messages page) */}
          {
            !serverId && <div className={`absolute -left-4 w-1 top-6.75 bg-white rounded-r-full 
              transition-all duration-300 
              h-0 group-hover:h-5 ${!serverId ? "h-5 w-1.5" : ""}`}></div>
          }
          <Tooltip id='direct-messages' place='right' className='z-50 font-bold'/>
        </Link>

        <hr className='border border-gray-400 w-11.5'/>
        {serverList!.map((server: Server, i: number) => (
          <button key={i}
            
            onClick={() => {
              if (!server.isAddButton){
                setServerObject(
                  server.serverId,
                  server.serverName, 
                  i,
                )
              } 
              else {
                handleFunction()
              }
            }}
            data-tooltip-id="my-server-tooltip" // Shared ID
            data-tooltip-content={server.serverName}
            className='h-11 w-11.5  flex 
            cursor-pointer items-center justify-center rounded-xl my-2 duration-200`
            relative group opacity-100
            '>
            
            {/* small UI that pops up when hovered */}
            <div 
              className={`absolute -left-4 w-1 bg-white rounded-r-full 
              transition-all duration-300 
              h-0 group-hover:h-5 
              /* Logic: 0 height pag normal, maliit pag hover, malaki pag active */
              /* Kung ito ang current server, gawin nating height-10 */

              ${serverId === server.serverId ? "h-5 w-1.5" : ""}
              `
            } 
            />
            
            {/* Server Icon */}

            {
              server.serverIcon 
              ? <img 
                src={server.serverIcon || ""}
                alt={server.serverName}
                className='h-full w-full rounded-xl object-cover'
              />
              : <div className={`h-full w-full rounded-xl font-semibold text-white
                duration-100 flex items-center justify-center hover:bg-indigo-400

                ${serverId === server.serverId 
                  ? "bg-indigo-500" 
                  : "bg-[#23272a] hover:bg-[#383c3f]"
                }`}>
                {getInitials(server.serverName)}
              </div>
            }
          </button>
        ))}

        {/* Add server button */}
        <button
          type='button'
          data-tooltip-id="my-server-tooltip" 
          data-tooltip-content="Create Server"
          className='h-11 w-11.5 bg-white hover:bg-indigo-500 flex 
            cursor-pointer items-center justify-center rounded-xl my-2 duration-200`
            relative group opacity-100'
            onClick={() => handleFunction()}
        >
          <BiPlusCircle className='text-2xl group-hover:text-white
          duration-100 text-gray-500'/> 
        </button>

        <Tooltip id="my-server-tooltip" place='right' className='z-50 font-bold opacity-100 bg-black'/>
      </div>
    </div>
  )
}

export default ServerList