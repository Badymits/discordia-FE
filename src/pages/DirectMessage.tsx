
import { useParams } from 'react-router-dom'
import { useServerContext } from '../context/ServerContext'
import { useCurrentUser } from '../context/UserContext';

import { FaEllipsisH, FaRegUserCircle } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { IoMdVideocam } from "react-icons/io";
import { TiPin } from "react-icons/ti";
import { useEffect, useRef, useState } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import { RiArrowRightSLine } from "react-icons/ri";
import { getConvoByUser } from '../utils/DummyData';
import { BsArrow90DegLeft, BsArrow90DegRight } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg'

const DirectMessage = () => {

  const {username} = useParams()
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false)
  const [hideMutualServer, setHideMutualServer] = useState<boolean>(false)

  const [img, setImg] = useState<string>()

  const user = useCurrentUser()
  const {getUser} = useServerContext();

  const latestMessage = useRef<HTMLDivElement>(null)

  const friendUser = getUser(username ?? "")

  // on channel change, automatically position view to latest message of channel
  const scrollToBottom = () => {
    latestMessage.current?.scrollIntoView({ behavior: "auto" }); 
  };


  const directMessages = getConvoByUser(friendUser.user) || [];

  useEffect(() => {
    scrollToBottom()
  }, [username, directMessages.length])

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
    {
      name: "FC Barcelona Champions League Winners 25/26",
      serverIcon: "https://api.dicebear.com/9.x/thumbs/svg?seed=Felix"
    },
  ]

  console.log(user)
  return (
    <div className='w-full bg-[#23272a] flex flex-col flex-1
    text-white h-screen overflow-hidden'>


      {/* DM Page Header */}
      <div className='border-b border-[#363c41] w-full p-2.75'>
        {/* Left side of header. User avatar and username */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center'>
            <div className='relative h-9 w-9'>
              <img 
                src={friendUser?.avatar} 
                alt={friendUser?.userTag}
                className='h-full w-full rounded-full bg-gray-200'
              />

              <div 
                className={`rounded-full absolute bottom-0 right-1 h-2 w-2 
                  ${friendUser?.status === "online" 
                  ? "bg-green-500"
                  : "bg-gray-500"
                  }`}
                ></div>
            </div>
            <p>{friendUser?.user || "John Doe"}</p>
          </div>
          
          {/* DM options */}
          <div>
            <div className='flex items-center gap-2'>
              {/* Message Icons */}
              <div className='flex items-center gap-5'>
                <FiPhoneCall />
                <IoMdVideocam />
                <TiPin />
                <FaRegUserCircle 
                  onClick={
                    () => setShowUserDetails(!showUserDetails)
                  }
                />
              </div>
              
              {/* Search bar */}
              <div>
                search...
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className='h-full w-full flex flex-1'>
        
        {/* Chat Container */}
        <div className='overflow-hidden flex-1 flex flex-col min-h-0 w-full border-r border-[#363c41]'>
          <div className='flex-1 overflow-y-auto  scrollbar-thin scrollbar-thumb-[#1e1f22] 
            scrollbar-track-transparent hover:scrollbar-thumb-[#a1a1a1]'>
            <div className="h-full flex flex-col justify-end p-4">
              <img 
                src={friendUser.avatar}
                alt={friendUser.user}
                className='h-25 w-25 rounded-full bg-gray-100' 
              />
              <p className="text-3xl font-bold">{friendUser.user}</p>
              <p className="text-2xl py-2 font-medium">{friendUser.userTag}</p>
              <p>This is the beginning of your direct message with&nbsp;
                <span className='font-bold'>{friendUser.user}</span>.
              </p>
            
              {/* Showing if theres mutual servers / User btn options */}
              <div>
                <button></button>
              </div>
              <button 
                type="button"
                className="bg-[#383a40] hover:bg-[#2e3035] text-white w-35 
                flex items-center justify-center gap-2
                my-2 py-2 rounded-lg cursor-pointer">
                <MdModeEdit />
                Edit Channel
              </button>
            </div>
            
            {/* If statement: img render. else statement: text render */}
            <div>

              {
                directMessages.map((message) => {
                  if (message.contentWithImg){
                    return (

                      // IMG CONTENT RENDER
                      <div
                        key={message.id}
                        className='py-2 flex group relative'
                        >
                          <div className='flex items-start gap-2 
                          group-hover:bg-white/10 w-full px-4 py-1'>
                            <div className="relative">
                              <img 
                                src={message.avatar} 
                                alt={message.user} 
                                className="w-12 h-12 rounded-full bg-gray-500" 
                              />

                              {/* member status */}
                              <span className="bg-green-400 h-2 w-2 absolute bottom-0 
                              left-9 rounded-full"></span>
                            </div>
                            

                            <div className="pl-2">
                              <p className="text-white">
                                <span className="font-semibold">{message.user}</span> &nbsp;
                                <span className="font-light">{message.timestamp}</span>
                              </p>
                              <img 
                                src={message.content} 
                                alt={message.user} 
                                className='max-h-160 max-w-160 pt-2 cursor-pointer'
                                onClick={() => setImg(message.content)}
                              />
                            </div>
                          </div>
                          <div className="absolute top-0 right-4 bg-[#2B2D31] 
                            text-lg flex items-center gap-2 p-1 opacity-0 
                            group-hover:opacity-100 rounded-md shadow-2xl">
      
                            <BsArrow90DegLeft 
                              data-tooltip-id="message-reply"
                              data-tooltip-content="Reply"
                              className="cursor-pointer p-0.5 
                              hover:bg-[#35373C] hover:text-[#DBDEE1]"
                            />
                            <BsArrow90DegRight 
                              data-tooltip-id="message-forward"
                              data-tooltip-content="Forward"
                              className="cursor-pointer p-0.5 
                              hover:bg-[#35373C] hover:text-[#DBDEE1]"
                            />
                            <FaEllipsisH 
                              data-tooltip-id="message-more"
                              data-tooltip-content="More"
                              className="cursor-pointer p-0.5 
                              hover:bg-[#35373C] hover:text-[#DBDEE1]"
                            />
                          </div>
      
                          <Tooltip id="message-reply" place="top" className="z-50"/>
                          <Tooltip id="message-forward" place="top" className="z-50"/>
                          <Tooltip id="message-more" place="top" className="z-50"/>
                          
                      </div>
                    )
                  } else {
                    return (

                      // TEXT CONTENT RENDER
                      <div 
                        key={message.id}
                        className='py-2 flex group relative'>

                          <div className='flex items-center gap-2 
                          group-hover:bg-white/10 w-full px-4 py-1'>
                            <div className="relative">
                              <img 
                                src={message.avatar} 
                                alt={message.user} 
                                className="w-12 h-12 rounded-full bg-gray-500" 
                              />

                              {/* member status */}
                              <span className="bg-green-400 h-2 w-2 absolute bottom-0 
                              left-9 rounded-full"></span>
                            </div>
                            

                            <div className="pl-2">
                              <p className="text-white">
                                <span className="font-semibold">{message.user}</span> &nbsp;
                                <span className="font-light">{message.timestamp}</span>
                              </p>
                              <p className="">{message.content}</p>
                            </div>
                          </div>

                          <div className="absolute top-0 right-4 bg-[#2B2D31] 
                            text-lg flex items-center gap-2 p-1 opacity-0 
                            group-hover:opacity-100 rounded-md shadow-2xl">
      
                            <BsArrow90DegLeft 
                              data-tooltip-id="message-reply"
                              data-tooltip-content="Reply"
                              className="cursor-pointer p-0.5 
                              hover:bg-[#35373C] hover:text-[#DBDEE1]"
                            />
                            <BsArrow90DegRight 
                              data-tooltip-id="message-forward"
                              data-tooltip-content="Forward"
                              className="cursor-pointer p-0.5 
                              hover:bg-[#35373C] hover:text-[#DBDEE1]"
                            />
                            <FaEllipsisH 
                              data-tooltip-id="message-more"
                              data-tooltip-content="More"
                              className="cursor-pointer p-0.5 
                              hover:bg-[#35373C] hover:text-[#DBDEE1]"
                            />
                          </div>
      
                          <Tooltip id="message-reply" place="top" className="z-50"/>
                          <Tooltip id="message-forward" place="top" className="z-50"/>
                          <Tooltip id="message-more" place="top" className="z-50"/>
                      </div>
                    )
                  }
                })
              }
              <div ref={latestMessage}/>
            </div>
          </div>

          <div className='p-1.5 flex-none'>
            <div className="bg-[#383a40] rounded-lg p-2 flex items-center">
              <input 
                type="text" 
                placeholder={`Message @${friendUser.userTag}`}
                className="bg-transparent w-full p-2 py-3 focus:outline-0"
              />
            </div>
          </div>
        </div>
        
        {/* Friend Details */}
        <div className='flex justify-center h-full'>
          {
            showUserDetails && (
              <div className='w-80 h-full bg-[#232428]'>

                <div className='relative'>
                  <div>
                    <div className="h-25 bg-blue-500 w-full " />
                    <FaEllipsisH 
                      
                      data-tooltip-id="more-user"
                      data-tooltip-content="More"
                      className="absolute top-2 right-2 text-black 
                      bg-white/50 rounded-full text-2xl p-1 
                      cursor-pointer focus:outline-0"
                    />

                    <Tooltip id="more-user" place="left" className="z-50"/>
                  </div>

                  {/* Friend Avatar and Details */}
                  <div className=''>

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
                      <p className='font-semibold'>{friendUser.user}</p>
                      <p className='text-xs'>{friendUser.userTag}</p>
                    </div>
                    
                  </div>
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
                          alt={friendUser.user}
                          className='h-12 w-12 rounded-full bg-white'
                        />
                      </div>

                      <div className='flex flex-col justify-center font-bold'>
                        {friendUser.user}
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