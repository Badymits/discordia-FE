import { memo, useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
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

import { DragDropProvider, PointerSensor, useDragOperation, type DragDropEventHandlers , useDraggable, useDroppable} from '@dnd-kit/react';
import { KeyboardSensor, PointerActivationConstraints } from '@dnd-kit/dom';
import { useSortable } from '@dnd-kit/react/sortable';
import {RestrictToElement} from '@dnd-kit/dom/modifiers';
import {RestrictToVerticalAxis} from '@dnd-kit/abstract/modifiers';
import {DragDropManager} from '@dnd-kit/abstract';


interface ServerListProps{
  serverList: Server[];
  handleFunction: () => void;
}

interface ServerItemProps{
  serverId: string;
  serverIdParam: string;
  serverName: string;
  serverIcon: string;
  index: number;
  container: React.RefObject<HTMLDivElement | null>;
}

const createDropZone = () => {
  const dropzone = document.createElement('div');
  dropzone.className = 'droppable';
  dropzone.classList.add("h-100")
  dropzone.classList.add("bg-red-300")

  return dropzone;
}

const sensors = [
  PointerSensor.configure({
    activatorElements(source){
      return [source.element, source.handle]
    },
    activationConstraints: [
      new PointerActivationConstraints.Delay({value: 100, tolerance: 50})
    ]
  }),
  KeyboardSensor
]

const getInitials = (serverName: string) => {
  return serverName
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

// const myDetector: CollisionDetector = ({dragOperation, droppable}) => {
//   if (!droppable.shape) return null;

//   // Your logic here — return null for no collision, or an object:
//   return {
//     id: droppable.id,
//     value: 1, // Higher values win
//     type: CollisionType.Collision,
//     priority: CollisionPriority.Normal,
//   };
// };

const ServerItem = memo(function ServerItem({
  serverId,
  serverIdParam,
  serverName,
  serverIcon,
  index,
  container
}: PropsWithChildren<ServerItemProps>){

  const dndManager = new DragDropManager();

  const serverIdTest = serverId

  const operation = useDragOperation();

  const { ref, isDragging } = useSortable({
    id: serverId,
    accept: "server",
    type: "server",
    modifiers: [
      RestrictToVerticalAxis,
      RestrictToElement.configure({
        element: container.current
      })
    ],
    collisionPriority:  10,
    index,
    data: {
      serverIdTest,
      CollisionPriority: 10
    }
  })

  if (isDragging && operation.target?.id){
    

    const dropZone = createDropZone();
    const item = document.createElement("div")
    item.textContent = "Newwwww"
    item.classList.add("h-70")
    item.classList.add("bg-gray-500")
    dropZone.appendChild(item)

    // const droppable = new Droppable(
    //   {
    //     id: "drop-zone",
    //     element: dropZone,
    //     effects: () => [
    //       () => {
    //         if (droppable.isDropTarget){
    //           dropZone.classList.add("active")
    //           return () => dropZone.classList.remove('active')
    //         }
    //       }
    //     ],
    //   }, dndManager
    // )

    // listens for drop events
    // dndManager.monitor.addEventListener("dragend", (event) => {
    //   if (event.operation.target?.id === droppable.id){

    //   }
    // })
  }

  // dndManager.monitor.addEventListener('collision', (event) => {
  //   const [firstCollision] = event.collisions;
  //   console.log("collision event occurred")
  //   console.log(firstCollision)
  // });

  return (
    <div 
      key={index}
      className='h-11 w-11.5 hover:bg-indigo-500 flex 
        cursor-pointer items-center justify-center rounded-xl my-2 duration-200`
        relative group opacity-100'
        data-tooltip-id="my-server-tooltip" // Shared ID
        data-tooltip-content={serverName}
        ref={ref}
      >
        {
          serverIcon 
          ? <img 
            src={serverIcon || ""}
            alt={serverName}
            className='h-full w-full rounded-xl object-cover'
          />
          : <div className={`h-full w-full rounded-xl font-semibold text-white
            duration-100 flex items-center justify-center hover:bg-indigo-400

            ${serverIdParam === serverId 
              ? "bg-indigo-500" 
              : "bg-[#23272a] hover:bg-[#383c3f]"
            }`}>
            <p className='select-none'>{getInitials(serverName)}</p>
            
          </div>
        }
    </div>
  )
})

interface ServerItemProps {
  serverId: string;
  index: number;
}

export const FinalServerItem = memo(function FinalServerItem({
  serverId,
  index
}: ServerItemProps) {
  
  const operation = useDragOperation();
  const isMeDragging = operation.source?.id === serverId;

  // 1. Handles picking up the item
  const { 
    ref: setDragRef 
  } = useDraggable({
    id: serverId,
    type: "server",
    data: { serverId, index }
  });

  // 2. Handles collision detection as a rigid, static target
  const { 
    ref: setDropRef 
  } = useDroppable({
    id: `drop-target-${serverId}`,
    type: "server",
    disabled: isMeDragging, 
    data: { serverId, index }
  });

  // 3. Merge both refs onto the single DOM node
  const setCombinedRef = (element: HTMLDivElement | null) => {
    setDragRef(element);
    setDropRef(element);
  };

  return (
    <div className="flex flex-col w-full relative">
      <div
        ref={setCombinedRef}
        className={`flex items-center justify-center 
          w-12 h-12 my-2 mx-auto
          cursor-pointer rounded-3xl transition-all duration-200
          ${isMeDragging ? "opacity-20 bg-gray-800" : "bg-[#313338] hover:bg-indigo-500 hover:rounded-2xl"}
        `}
      >
        <span className="text-white text-xs select-none">SRV</span>
      </div>
    </div>
  );
});

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

  const { data: fetchedServers, isLoading } = useQuery({
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

  const serverList: Server[] = fetchedServers?.data || []
  // will be used when testing actual servers
  //const [fetchedsServerList, setFetchedServerList] = useState(fetchedServers?.data || [])

  const [sampleServers, setSampleServers] = useState<Server[]>([
    {
      serverId: "3331",
      serverName: "Sample331 A"
    },
    {
      serverId: "3332",
      serverName: "Sample332 B"
    },
    {
      serverId: "3333",
      serverName: "Sample333 C"
    },
  ])

  const serverListSnapshot = useRef(structuredClone(sampleServers))
  const serverListContainer = useRef<HTMLDivElement>(null);

  console.log("testing server list: ", serverList)

  const setServerObject = (
    serverId: string,
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

  const onDragStart = useCallback<DragDropEventHandlers["onDragStart"]>(() => {
    serverListSnapshot.current = structuredClone(sampleServers)
  }, [sampleServers])

  const onDragOver = useCallback<DragDropEventHandlers["onDragOver"]>((event) => {
    const { source, target } = event.operation;

    if (!source || source.id === target?.id){
      return;
    }

    console.log(source.id, target?.id)

    const draggedPriority = source?.data.CollisionPriority || 0;
    const targetPriority = target?.data.CollisionPriority || 0;

    console.log("Dragged priority: ", event.operation.source?.data)
    console.log("Target Priority: ", event.operation.target?.data)

    if (draggedPriority > targetPriority){
      console.log("Not Same")
    } else {
      console.log("same")
    }
    
  }, [])

  const onDragEnd = useCallback<DragDropEventHandlers["onDragEnd"]>((event) => {

    if (event.canceled){
      setSampleServers(serverListSnapshot.current)
      return;
    }
  }, [])

  if (isLoading || isNotificationLoading) {
    return <ServerListLoader />
  }
    
  return (
    <div className='bg-[#111113] w-19.5 h-full px-2 shrink-0'>
    
      <div className='w-full flex flex-col items-center' ref={serverListContainer}> 
      
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
            !serverId && <div className={
              `absolute -left-4.75 w-1 top-3.75 bg-white rounded-r-full transition-all duration-300 
              h-0 group-hover:h-5 group-hover:top-6 ${!serverId ? "h-10 w-1.5" : ""}`}></div>
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
        <DragDropProvider
          sensors={sensors}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          {sampleServers.map((server: Server, index: number) => (
            <ServerItem 
              serverId={server.serverId || ""}
              serverName={server.serverName}
              serverIcon={server.serverIcon || ""}
              serverIdParam={serverId || ""}
              index={index}
              container={serverListContainer}
            />
          ))}

        </DragDropProvider>

        <Link
          to="/dummyserver"
          type='button'
          data-tooltip-id="server-playground" 
          data-tooltip-content="Server Playground"
          className='h-11 w-11.5 bg-white hover:bg-indigo-500 flex 
            cursor-pointer items-center justify-center rounded-xl my-2 duration-200`
            relative group opacity-100'
          
        >
          <p>SP</p>
        </Link>

        <Tooltip id="my-server-tooltip" place='right' className='z-50 font-bold opacity-100 bg-black'/>
        <Tooltip id="server-playground" place='right' className='z-50 font-bold opacity-100 bg-black'/>
      </div>
    </div>
  )

}

export default ServerList