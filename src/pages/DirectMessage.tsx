import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query';
import { fetchDirectChannel } from '../query/serverQueries';
import MessagesComponent from '../components/MessagesComponent';

import { FaEllipsisH } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import { RiArrowRightSLine } from "react-icons/ri";
import { CgClose } from 'react-icons/cg'

import type { ServerUser } from '../types/User';
import { convertObj } from '../utils/ConvertedObject';
import type { NotificationPayload } from '../types/ServerTypes';
import { useWebSocketContext } from '../context/WebSocketContext';

const DirectMessage = () => {

  const { directChannelId } = useParams()
  const { socketConnection } = useWebSocketContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false)
  const [hideMutualServer, setHideMutualServer] = useState<boolean>(false)

  const [img, setImg] = useState<string>()

  const [currentUser] = useState<ServerUser>(() => {
    const userObj = sessionStorage.getItem("UserObj")
    const user = userObj ? JSON.parse(userObj) : null

    if (user) return {
      userId: user.userId,
      displayName: user.displayname,
      username: user.username,
      email: user.email,
      imgUrl: "" // will update session obj later (as of May 15 4:02pm lmao)
    }

    return {} as ServerUser
  })

  const latestMessage = useRef<HTMLDivElement>(null)


  const { data: directChannelData, isLoading, isError: directChannelError } = useQuery({
    ...fetchDirectChannel(directChannelId || ""),
    enabled: !!directChannelId,
    staleTime: 1000 * 10 * 60,
    gcTime: 1000 * 10 * 60
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

  console.log("Direct Channel Data: ", directChannelData)
  const friendUser = directChannelData?.data?.
    directChannelParticipants.find((userData: ServerUser) => userData.userId !== currentUser?.userId)

  console.log("mi amigo", friendUser)
  console.log(currentUser)

  // on channel change, automatically position view to latest message of channel
  const scrollToBottom = () => {
    latestMessage.current?.scrollIntoView({ behavior: "auto" }); 
  };
 

  useEffect(() => {
    scrollToBottom()
  }, [directChannelId])



  const sampleMutualServers = [
    {
      name: "Server 1",
      serverIcon: "https://api.dicebear.com/9.x/rings/svg?seed=Felix"
    },
    {
      name: "Dayumm Son",
      serverIcon: "https://api.dicebear.com/9.x/identicon/svg?seed=Felix"
    },
    {
      name: "The Zone",
      serverIcon: "https://api.dicebear.com/9.x/shapes/svg?seed=Felix"
    },
  ]

  if (isLoading){
    return (
      <div>
        Loading...
      </div>
    )
  }

  if ( directChannelError){
    return(
      <div>
        Error. Please try again later
      </div>
    )
  }

  return (
    <div className='w-full h-screen flex items-center'>

      <div className='grow'>
        <MessagesComponent 
          messageType='direct'
          channelId={directChannelId || ""}
          conversationDetails={convertObj(friendUser || {} as ServerUser, "direct")}
          currentUser={currentUser}
          userRecipientDetails={friendUser}
          key={directChannelId || ""}
        />
      </div>
      
      <div className='flex justify-center h-full'>
        {
          showUserDetails && (
            <div className='w-80 h-full bg-[#232428]'>
              <div className='relative'>
                <div className='h-25 bg-blue-500 w-full'></div>

                <FaEllipsisH 
                  data-tooltip-id="more-user"
                  data-tooltip-content="More"
                  className="absolute top-2 right-2 text-black 
                  bg-white/50 rounded-full text-2xl p-1 
                  cursor-pointer focus:outline-0"
                />
                <Tooltip id="more-user" place="left" className="z-50"/>
              </div>

              <div className='relative'>
                <img 
                  src={friendUser.avatar} 
                  alt={friendUser.userTag}
                  className='w-26 h-26 rounded-full bg-gray-500 ml-2 -mt-12 
                  border-6 border-[#232428]' 
                />

                <div className={`rounded-full absolute bottom-1 left-20 w-6 
                  h-6 border-6 border-[#232428] ${
                    friendUser.status == "online" 
                      ? "bg-green-700" 
                      : friendUser.status == "idle" 
                        ? "bg-yellow-500"
                        : friendUser.status == "away"
                          ? "bg-red-700"
                      : "bg-gray-500"
                  }`}>
                </div>
              </div>

              <div className='px-4 pt-5'>
                <p className='font-semibold'>{friendUser.user?.displayName}</p>
                <p className='text-xs'>{friendUser.user?.username}</p>
              </div>
              <div className=''>
                  <div className='bg-[#313133] p-3 m-4 rounded-lg flex flex-col items-start gap-2 cursor-default'>
                    <p className='font-bold text-xs ' >Member Since</p>
                    <p className='font-light'>{friendUser.dateJoined}</p>
                  </div>

                  {sampleMutualServers && (
                    <div className={`bg-[#313133] p-3 m-4 rounded-lg flex 
                      flex-col items-start gap-2 overflow-hidden transition-all duration-500
                      ${hideMutualServer ? "max-h-12" : "max-h-96"}`}>

                      <div className='flex justify-between items-center w-full'
                        onClick={() => setHideMutualServer(!hideMutualServer)}
                        >
                        <p>Mutual Servers --- {sampleMutualServers.length}</p>
                        <RiArrowRightSLine 
                          className={`
                            ${hideMutualServer ? "" : "rotate-90"}
                            text-xl duration-200`}
                        />
                      </div>
                      
                      {
                        sampleMutualServers.map((server, i) => (
                          <div 
                            key={i}
                            className='flex items-center gap-2 py-2'
                            > 
                              <img 
                                src={server.serverIcon} 
                                alt={server.name} 
                                className='h-12 w-12 rounded-lg bg-white'
                              />
                              {server.name}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
            </div>
          )
        }
      </div>
      {
        img && (
          <div className={`fixed inset-0 bg-black/90  z-50
            flex items-center justify-center duration-200 transition-opacity ease-in-out
            ${img ? "opacity-100 visible" : "opacity-0 invisible"}`}>
              <div className='h-200 w-250'>
                  <img 
                    src={img} 
                    alt="sampleImg"
                    className='mt-5' 
                  />

                  <div className='absolute top-0 right-0 w-full
                  flex items-center justify-between'>

                    <div className='flex items-center m-6 gap-2'>
                      <div>
                        <img 
                          src={friendUser.avatar} 
                          alt={friendUser.user?.username || ""}
                          className='h-12 w-12 rounded-full bg-white'
                        />
                      </div>

                      <div className='flex flex-col justify-center font-bold'>
                        {friendUser.user?.username}
                        <p className='font-light text-gray-400'>
                          {friendUser.dateJoined}
                        </p>
                      </div>
                      
                    </div>

                    <div className='flex items-center m-6 gap-6'>

                      <div className='bg-[#2c2f33] text-2xl'>
                        icons...
                      </div>

                      <CgClose 
                        data-tooltip-id="close"
                        data-tooltip-content="Close"
                        className='bg-[#2c2f33] rounded-md 
                          text-4xl cursor-pointer hover:bg-white/10 p-2'
                        onClick={() => setImg("")}
                      />
                    </div>

                    <Tooltip id='close' place='bottom' className='z-50'/>
                  </div>
                  
              </div>
          </div>
        )
      }
    </div>
  )
}

export default DirectMessage