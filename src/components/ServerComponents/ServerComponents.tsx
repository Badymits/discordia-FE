/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useState, useRef, useEffect, type MouseEvent } from "react";
import { ServerContext } from "../../context/ServerContext";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "react-tooltip";

import { AiOutlineUsergroupAdd, AiOutlineAudioMuted } from "react-icons/ai";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiHashtag  } from "react-icons/ri";
import { CiSettings } from 'react-icons/ci'
import { IoMdAdd, IoMdAddCircle  } from "react-icons/io";
import { FaSearch, FaEllipsisH, FaFolderPlus } from "react-icons/fa";
import { CgClose } from "react-icons/cg"

import { HiHashtag, HiLockClosed } from "react-icons/hi";
import { BsDiscord } from "react-icons/bs";
import { PiSpeakerSimpleHighLight } from "react-icons/pi";

import  { voiceChannelMembers } from "../../utils/DummyData";
import CreateChannelModal from "../ServerComponents/CreateChannelModal";
import InviteToServer from "../InviteToServer";
import CreateCategoryModal from "./CreateCategoryModal";
import type { 
  Category, 
  Channel, 
  ServerMembers, 
} from "../../types/ServerTypes";

import { useCurrentUser } from "../../context/UserContext";
import { 
  fetchChannel, 
  fetchServer, 
} from "../../query/serverQueries";
import ServerSettings from "./ServerSettings";
import ChannelSettings from "./ChannelSettings"; 
import ServerComponentLoader from "../LoadingComponents/ServerComponentLoader";
import CategorySettings from "../CategorySettingsComponents/CategorySettings"
import { CategorySettingsMenu } from "../../utils/PanelSettings";
import type { ServerUser, User } from "../../types/User";
import MessagesComponent from "../MessagesComponent";
import { convertObj } from "../../utils/ConvertedObject";




const ServerComponents = () => {


  const [activeChannel, setActiveChannel] = useState<string>()
  const [showMemberList, setShowMemberList] = useState<boolean>(false)
  const [openMemberSetting, setOpenMemberSetting] = useState<boolean>(false)

  const [createChannelModal, setCreateChannelModal] = useState<boolean>(false)
  const [openInviteModal, setInviteModal] = useState<boolean>(false)
  const [createCategoryModal, setCreateCategoryModal] = useState<boolean>(false)
  const [openServerSettingsPanel, setOpenServerSettingsPanel] = useState<boolean>(false)
  const [openServerSettings, setOpenServerSettings] = useState<boolean>(false)
  const [openChannelSettings, setOpenChannelSettings] = useState<boolean>(false)
  const [openChannelTopic, setOpenChannelTopic] = useState<boolean>(false)
  const [openCategorySettings, setOpenCategorySettings] = useState<boolean>(false)

  const [categoryName, setCategoryName] = useState<string>("")
  const [categoryId, setCategoryId] = useState<string | undefined>("")

  const [showCategorySettings, setShowCategorySettings] = useState(false)
  const [panelCoords, setPanelCoords] = useState({x: 0, y: 0})

  const { 
    isInVoice,
    // setIsInVoice,
    // setJoinedVoiceChannel
  } = useCurrentUser();

  const serverContext = useContext(ServerContext)


  if (!serverContext) throw new Error("BULOK TypeScript")
  const {
    server
  } = serverContext

  const { serverId } = useParams();

  const { 
    data: serverChannels, 
    isLoading, 
    status, 
    fetchStatus 
  } = useQuery({
    ...fetchServer(serverId || ""),
    enabled: !!serverId,
    retry: 1, 
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 5,
  })

  // 1. EFFECT PARA SA SERVER SWITCH (Reset Logic)
  useEffect(() => {
    if (serverId) {
      console.log("Server changed! Resetting active channel to null...");
      setActiveChannel(""); // Erase/ Reset active channel value to prevent loading previous content
    }
  }, [serverId]);

  useEffect(() => {

    if (!serverId){
      console.log("no server ID detected")
      return;
    }

    // if theres no active channel ID but serverChannels' is already available, 
    // then use that to retrieve the serverChannels query
    if (serverId && !activeChannel && serverChannels?.serverCategories?.length > 0) {

      const defaultId = 
        serverChannels.serverCategories[0].categoryChannels?.[0]?.channelId;
      
      if (defaultId) {
        console.log("Setting default channel for new server: ", defaultId);
        setActiveChannel(defaultId);
      }
    }

  }, [
    serverId, 
    activeChannel, 
    serverChannels?.serverCategories
  ])

  //  1000 represents milliseconds in a second. 
  // 5 represents the number of minutes. 
  // 60 represents seconds in an hour (though typically written as 1000 * 60 * 5, 
  // the multiplication order does not change the result)
  const { data: selectedChannel } = useQuery({
    ...fetchChannel(
      activeChannel ?? ""
    ),
    enabled: !!activeChannel,
    staleTime: 1000 * 60 * 5,
  })


  console.log("the server: ", serverChannels)
  console.log("general channel members: ", serverChannels?.serverMembers)
  console.log("the channel: ", selectedChannel)


  console.log({
      ID_CHECK: serverId,
      QUERY_STATUS: status, // 'pending', 'error', or 'success'
      NETWORK_STATUS: fetchStatus, // 'fetching', 'paused', or 'idle'
      RAW_DATA: serverChannels
  });

  const [serverMemberDetails, setServerMemberDetails] = useState<ServerMembers>({
    memberId: "",
    serverNickname: "",
    displayName: "",
    username: "",
    bio: "",
    imgUrl: ""
  })

  const [currentUser] = useState<ServerUser>(() => {
    const userObj = sessionStorage.getItem("UserObj")
    const user = userObj ? JSON.parse(userObj) : null
    
    // just returning random user with default values
    if (user === null) return {
      userId: "100",
      displayName: "display name user",
      username: "userName",
      bio: "userTag",
      imgUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=100"
    }
    
    return {
      userId: user.userId,
      displayName: user.displayname,
      username: user.userName,
      bio: "",
      imgUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=45",

    }
  })

  const [sampleVoiceChannelMembers, 
    setSampleVoiceChannelMembers] = useState<ServerMembers[]>(voiceChannelMembers)

  const createChannelRef = useRef<HTMLDivElement>(null)
  const latestMessage = useRef<HTMLDivElement>(null)

  // Side panel that contains server member details 
  const memberPanel = useRef<HTMLDivElement>(null!)

  // Panel for settings such as "View Full Profile, Ignore, Report, and Copy User ID"
  const memberPanelSetting = useRef<HTMLDivElement>(null!)

  const serverSettingsPanel = useRef<HTMLDivElement>(null!)


  // on channel change, automatically position view to latest message of channel
  const scrollToBottom = () => {
    latestMessage.current?.scrollIntoView({ behavior: "auto" }); 
  };

  console.log(selectedChannel?.channelName)



  const LockedChannelIcon = () => {
    return (
      <div className="relative flex items-center justify-center w-5 h-5">
        {/* Main Hashtag */}
        <HiHashtag className="text-[#80848E] text-xl" />
        
        {/* Ang Maliit na Lock sa Corner */}
        <div className={`absolute -top-0.5 -right-0.5 
          p-[0.5px] bg-[#111113] rounded-full`}>
          <HiLockClosed className="text-[#80848E] text-[10px]" />
        </div>
      </div>
    );
  };

  

  // to return channel icon when saved/ stringified in session storage since ReactNode cannot be stringified.
  const iconMap = {
    "hash": <RiHashtag />,
    "text": <RiHashtag />,
    "voice": <PiSpeakerSimpleHighLight className="text-xl"/>,
    "lock": LockedChannelIcon()
  }

  const serverSettings = [
    {
      name: "Invite to Server",
      value: "invite",
      icon: <AiOutlineUsergroupAdd />
    },
    {
      name: "Server Settings",
      value: "settings",
      icon: <CiSettings />
    },
    {
      name: "Create Channel",
      value: "channel",
      icon: <IoMdAddCircle />
    },
    {
      name: "Create Category",
      value: "category",
      icon: <FaFolderPlus />
    }
  ]

  // handles the member panel on the right side of the page when hovering over server members
  useEffect(() => {
    const handleMemberPanelClick = (event: Event) => {
      const mouseEvent = event as globalThis.MouseEvent;
      if ((memberPanel.current && 
            !memberPanel.current.contains(mouseEvent.target as Node)) ||
          (memberPanelSetting.current 
            && memberPanelSetting.current.contains(mouseEvent.target as Node))) {
        setServerMemberDetails({
          memberId: "0",
          user: {} as User,
          displayName: "",
          username:"",
          userTag: "",
          avatar: ""
        })
        setOpenMemberSetting(false) // Close the action tab when clicking outside
      }
    }

    document.addEventListener("mousedown", 
      handleMemberPanelClick);

    return () => {
      document.removeEventListener("mousedown", 
        handleMemberPanelClick);
    }
  }, [])

  // handles the server settings panel div
  useEffect(() => {

    const handleServerSettingsPanelClick = (event:Event) => {
      const mouseEvent = event as globalThis.MouseEvent;
      if (serverSettingsPanel.current && 
          !serverSettingsPanel.current.contains(mouseEvent.target as Node)){
        setOpenServerSettingsPanel(false)
      }
    }

    document.addEventListener("mousedown", 
      handleServerSettingsPanelClick)

    return () => {
      document.removeEventListener("mousedown", 
        handleServerSettingsPanelClick)
    }
  },[])

  useEffect(() => {
    const handleContextMenuClick = () => {
      //const mouseEvent = event as globalThis.MouseEvent;

      setPanelCoords({x: 0, y: 0})
      setShowCategorySettings(false)

    }
    document.addEventListener("mousedown", handleContextMenuClick)

    return () => {
      document.removeEventListener("mousedown", handleContextMenuClick)
    }
  }, [])


  useEffect(() => {
    scrollToBottom();
  }, [
    activeChannel,
  ]); // Ititrigger to pag nagbago ang messages O ang channel ID

  useEffect(() => {

    const handleLeaveVoice = () => {
      setSampleVoiceChannelMembers((prev) => 
        prev.filter((member) => member.memberId !== currentUser.userId)
      )
    }

    // onclick (in Layout.tsx)
    if (isInVoice === false){
      handleLeaveVoice()
    }
    
  }, [isInVoice, currentUser.userId])

  // handles two set states instead of setting both in onClick attribute
  const handleSetActiveChannelAndVoiceChannel = (
    activeChannel: string, 
    channelType: string 
  ) => {
    const isAlreadyInVoice = sampleVoiceChannelMembers.some(
      (member) => member.memberId === currentUser.userId
    );

    // useful when switching channels (will add members and messages here as well)
    setActiveChannel(activeChannel)

    if (channelType === "voice" && !isAlreadyInVoice){
      // addMemberToVoiceChannel(
      //   currentUser,
      //   selectedChannel
      // )
      return;
    }
    
  }

  // to be used in the server settings panel
  const handleSettingToggle = (setting: string) => {

    switch(setting){
      case "invite":
        setInviteModal(true)
        break;

      case "settings":
        setOpenServerSettings(true)
        break;
        
      case "channel":
        setCreateChannelModal(true)
        break;

      case "category":
        setCreateCategoryModal(true)
        break;

      default:
        break;
    }
  }


  const handleCreateChannelModal = () => {
    setCreateChannelModal(!createChannelModal)
  }
  // mamaya na toh
  // const addMemberToVoiceChannel = (
  //     member: ServerUser, 
  //     channel: Channel
  //   ) => {

  //   // updates list of members that are in the voice channel
  //   setSampleVoiceChannelMembers(prev => [...prev, member])

  //   // calling user context setState to for (lower left) user panel to update UI
  //   setIsInVoice(true) 

  //   // values will be used in User Profile (lower left panel) when joining voice channel
  //   setJoinedVoiceChannel({
  //     channelId: channel.channelId,
  //     channelName: channel.channelName,
  //     serverName: serverChannels.serverName || ""
  //   })
  // }



  // sets active channel to general when other channels have been deleted
  const selectOnChannelDelete = () => {
    const generalChannel = serverChannels?.serverCategories[0]?.categoryChannels[0]
    if (generalChannel){
      setActiveChannel(
        generalChannel.channelId
      )
    } else {
      setActiveChannel("")
    }
  }


  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setShowCategorySettings(true)
    setPanelCoords({
      x: event.clientX,
      y: event.clientY
    })
  }

  if (status === "pending" || fetchStatus === "fetching" || isLoading){
    return <ServerComponentLoader />
  }
  console.log("selectedChannel: ", selectedChannel)

  return (
    <div className="flex w-full h-screen">

      <div className="bg-[#111113] shrink-0 text-white
        border-x border-[#363c41] truncate w-70">
        
        {/* Server name | Server Settings Pannel */}
        <div className="flex justify-between items-center 
          px-2 border-b border-[#363c41] relative">

          <div 
            className="font-bold flex items-center 
            cursor-pointer hover:bg-white/10 p-2 rounded-md"
            onClick={() => setOpenServerSettingsPanel(
              !openServerSettingsPanel
            )}
            >
            {serverChannels.serverName}

            <RiArrowDownSLine className={`
              text-xl duration-100
              ${openServerSettingsPanel ? "rotate-180" : ""}
              `}
            />

          </div>

          <AiOutlineUsergroupAdd className="text-3xl hover:bg-white/10 
            rounded-full cursor-pointer m-2 p-1"
            onClick={() => setInviteModal(true)}
          />

          {/* Server Settings Panel */}
          {
            openServerSettingsPanel && (
              <div className="absolute top-11 left-4 bg-[#2B2D31] 
                rounded-lg shadow-2xl text-[14px] font-bold text-[#DBDEE1] z-50"
                ref={serverSettingsPanel}
                >
                {serverSettings.map((setting, i) => (
                  <div key={i}
                      className="p-1 flex items-center justify-between 
                      gap-18 hover:bg-white/5 m-2 rounded-md cursor-pointer"
                      onClick={() => {
                        handleSettingToggle(setting.value)
                        setOpenServerSettingsPanel(false)
                      }}
                    >
                    {setting.name}
                    <p className="text-2xl">
                    {setting.icon}
                    </p>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Channel List */}
        <div className="flex flex-col py-5 px-1 text-[#949BA4] relative">
          {
            (serverChannels.serverCategories || []).map((list: Category, i: number) => (
              <div key={i}>
                <div className="relative">

                  {/* Category Settings Panel */}
                  {
                    showCategorySettings && (
                      <div className={` bg-[#2c2f33] shadow-2xl pointer-events-auto
                      fixed z-999 rounded-md px-3 text-sm font-semibold text-white`}
                      //ref={replyMessageRef}
                      style={{
                        top: panelCoords.y,
                        left: panelCoords.x
                      }}
                      >
                        {CategorySettingsMenu.map((cat) => (
                          <div
                            key={cat.id}
                            className={`${cat.showBorder && "border-[#363c41] border-b-2 mb-2"} 
                            pointer-events-auto
                            cursor-pointer hover:bg-white/10 py-2 px-1 my-1 border-spacing-5 rounded-md
                            `}
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setCategoryName(list.categoryName)
                              setCategoryId(list.categoryId)
                              setOpenCategorySettings(true)
                              setShowCategorySettings(false)
                            }}
                          >
                            <p className={`${cat.id === 106 && "text-red-400 hover:bg-red-500/10"}`}>
                              {cat.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )
                  }

                  {/* Channel Section Name and Icons */}
                  <div className="pt-2 text-[14px] pl-1 flex justify-between
                    items-center cursor-pointer hover:text-[#DBDEE1] group">

                    <div className="flex items-center gap-1" onContextMenu={handleContextMenu}>
                      {list.categoryName}
                      <RiArrowDownSLine 
                        className="group-hover:-rotate-90 duration-150"/>
                    </div>
                    
                    {/* Add Channel In Category Icon */}
                    {/* Should only be visible if server owner */}
                    <IoMdAdd 
                      className="mr-2 text-[16px]"
                      data-tooltip-id="create-channel"
                      data-tooltip-content="Create Channel"
                      onClick={() => {
                        setCreateChannelModal(true)
                        setCategoryId(list.categoryId)
                        setCategoryName(list.categoryName)
                      }}
                    />

                    <Tooltip 
                      id="create-channel" 
                      place="top" 
                      className="z-50" 
                      style={{
                        background: "#212222",
                        borderRadius: '10px',
                      }}
                    />
                  </div>

                  {/* Channel Names */}
                  <div className="">
                    {(list.categoryChannels || []).map((channel: Channel, i: number) => (
                      <div key={i}>
                        <div
                          className={`flex items-center justify-between 
                          text-[17px] font-semibold py-1 my-1 
                          cursor-pointer rounded-md px-2 group
                          
                          ${activeChannel === channel.channelId 
                            ? "bg-white/30 text-white" 
                            : "hover:bg-white/10 hover:text-[#DBDEE1] "} 
                          `}
                          onClick={() => handleSetActiveChannelAndVoiceChannel(
                            channel.channelId,
                            channel.channelType || "",
                          )}
                        >
                          <div className="flex items-center gap-1">

                            {channel.isPrivate 
                              ? <LockedChannelIcon /> 
                              : iconMap[channel.channelType as keyof typeof iconMap] 
                                || <RiHashtag />
                            }
                            <p className="truncate w-45">
                              {channel.channelName}
                            </p>
                          </div>

                        <div className={`flex opacity-0 
                          group-hover:opacity-100 font-extrabold
                          ${activeChannel === channel.channelId
                            ? "opacity-100"
                            : ""
                          }
                          `}>
                            <CiSettings 
                              data-tooltip-id="channel-settings"
                              data-tooltip-content="Edit Channel"
                              className="text-xl"
                              onClick={() => {
                                setCategoryName(list.categoryName)
                                setOpenChannelSettings(true)
                              }}
                            />
                            <AiOutlineUsergroupAdd 
                              data-tooltip-id="channel-invite"
                              data-tooltip-content="Invite to Channel"
                              className="text-xl"
                              onClick={() => 
                                setInviteModal(true)
                              }
                            />
                          </div>
                          <Tooltip 
                            id="channel-settings" 
                            place="top" 
                            className="z-50" 
                            style={{fontSize: '12px'}}
                          />
                          <Tooltip 
                            id="channel-invite" 
                            place="top" 
                            className="z-50" 
                            style={{fontSize: '12px'}}
                          />
                        </div>
                        {
                          (channel.channelType === "voice") &&
                          sampleVoiceChannelMembers.map((member) => (
                            <div key={member.memberId}>
                              <div className="ml-8 hover:bg-white/10 rounded-md 
                              p-1.25 cursor-pointer">

                                <div className="flex items-center gap-2 w-full">
                                  <img 
                                    src={member.avatar} 
                                    alt={member.userTag}
                                    className="h-6 w-6 rounded-full bg-white" 
                                  />
                                  <p>
                                    {member.userTag} 
                                  </p>

                                  {member.serverMemberStatus?.isMuted &&
                                    <AiOutlineAudioMuted 
                                    className="ml-auto mr-1.5"
                                    />
                                  }
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      
      {/* Content: If user is in VOICE CHAT, show voice chat content.
          ELSE: show message container
      */}
      {
        selectedChannel?.channelType === "voice" ?
        <div className="bg-[#111118] h-full w-full relative">
          <div className={`grid grid-col gap-4 grid-cols-2 
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
            {
              sampleVoiceChannelMembers.map((member) => (
                <div key={member.memberId} className="bg-gray-500 rounded-lg p-10 
                  flex flex-col justify-center items-center gap-6">

                  <img 
                    src={member.avatar}
                    alt={member.userTag}
                    className="h-22 w-22 rounded-full bg-white"
                  />
                  <p className="bg-black/60 text-white rounded-xl p-2">
                    {member.userTag}
                    {member.serverMemberStatus?.isMuted && 
                      <AiOutlineAudioMuted className="inline-block ml-2 mb-1"/> }
                  </p>
                </div>
              ))
            } 
            {!isInVoice && (
              <div className="bg-[#111113] p-10 flex flex-col justify-center items-center">
                <button 
                  type="button"
                  className="bg-white text-black p-2 rounded-lg font-bold hover:bg-gray-200 transition"
                  onClick={() => {}
                    //addMemberToVoiceChannel(currentUser, selectedChannel)
                  }
                >
                  Join Voice Channel
                </button>
              </div>
            )}
          </div>
        </div>

        :
        // show chat container and member list when in 
        // different channels (EVEN WHEN THEY ARE IN THE VOICE CHAT)
        <div className="w-full flex h-screen">

          <MessagesComponent 
            messageType="server"
            conversationDetails={convertObj(selectedChannel || {} as Channel, "server")}
            channelId={activeChannel || ""}
            currentUser={currentUser}
            key={serverId || ""}
          />
          
          {/* Channel/Server Member list */}
          <div className={`bg-[#23272a] text-[#DBDEE1] shrink-0 px-4
            ${showMemberList ? "hidden" : ""}
            `}>

            {/* Search bar */}
            <div className='relative my-4'>
              <input 
                placeholder={`Search ${serverChannels.serverName}`}
                className='bg-[#111113] focus:outline-[#7289DA] focus:outline-2 
                text-[#ffffff] p-2 pl-9  rounded-md cursor-pointer w-64' />
              <FaSearch className='absolute left-2 top-2.5 text-gray-500 text-lg'/>
            </div>

            <p className="text-sm text-[#949BA4]">
              Online - {serverChannels?.serverMembers?.length}
            </p>
            
            {
              (serverChannels?.serverMembers || []).map((member: ServerMembers) => (
                <div 
                  key={member.memberId}
                  >
                  <div className="relative">

                    {/* Member list  */}
                    <div 
                      className="flex items-center gap-2 py-1.5 
                      hover:bg-white/10 px-1.5 rounded-md cursor-pointer relative"
                      onClick={() => setServerMemberDetails({
                        memberId: member.memberId,
                        serverNickname: member.serverNickname,
                        username: member.user?.username || "",
                        displayName: member.user?.displayName || "",
                        bio: member.bio,
                        imgUrl: member.imgUrl
                      })}>
                      
                      {
                        member.imgUrl 
                        ? <img 
                            src={member.imgUrl} 
                            alt={member.serverNickname} 
                            className="w-8 h-8 rounded-full bg-gray-500" 
                          />
                        : <BsDiscord 
                          className="bg-indigo-500 h-8 w-8 rounded-full p-1"
                        />
                      }
                      
                      <p>{member.serverNickname}</p>

                      <span className="bg-green-400 h-2 w-2 absolute bottom-1 
                      left-7 rounded-full"></span>
                    </div>
                    
                    {/* Server member details panel */}
                    {serverMemberDetails.memberId === member.memberId && (
                      <div className="absolute top-3 -left-90
                        bg-[#232428] z-50 rounded-md shadow-4xl"
                        ref={memberPanel}
                        >

                        <div className="relative">
                          {/* member banner/Cover photo */}
                          <div>
                            <div className="h-25 bg-blue-500 w-full rounded-t-md" />
                            <FaEllipsisH 
                              onClick={() => setOpenMemberSetting(!openMemberSetting)}
                              data-tooltip-id="more-user"
                              data-tooltip-content="More"
                              className="absolute top-2 right-2 text-black 
                              bg-white/50 rounded-full text-2xl p-1 
                              cursor-pointer focus:outline-0"
                            />

                            <Tooltip id="more-user" place="top" className="z-50"/>
                          </div>
                          

                          {/* member details */}
                          <div className="w-85">

                            <div className="p-4">

                              {
                                serverMemberDetails.imgUrl
                                ? <img 
                                    src={serverMemberDetails.imgUrl} 
                                    alt={serverMemberDetails.serverNickname} 
                                    className="h-24 w-24 -mt-12  rounded-full
                                    border-6 border-[#232428] bg-gray-600"
                                  />
                                : <BsDiscord 
                                  className="h-24 w-24 bg-indigo-500 border-6
                                  border-[#232428] p-1 rounded-full -mt-12"
                                />
                              }
                              

                              <p className="text-xl font-semibold text-white pl-2">
                                {serverMemberDetails.serverNickname}
                              </p>

                              <p className="text-sm pl-2 font-light">
                                {serverMemberDetails.username}
                              </p>
                              
                              {/* Should be visible only to admin */}
                              <div className="text-xs pt-4 flex items-center gap-1">
                                <IoMdAdd /> Add Role
                              </div>
                            </div>

                            {/* On text submit, user should be redirected 
                            to new chat/DM with user they messaged */}
                            <div className="p-4">
                              <input 
                                type="text" 
                                className="w-full bg-[#383a40] p-2" 
                                placeholder={`Message @${serverMemberDetails.serverNickname}`}
                              />
                            </div>
                          </div>

                          {/* Server member options panel */}
                          {
                            openMemberSetting && (
                              <div className="absolute top-0 -right-40
                              bg-[#303136] flex flex-col gap-2 rounded-md p-2
                                items-start text-left font-semibold"
                                ref={memberPanelSetting}
                              >

                              <button className="cursor-pointer 
                                hover:bg-white/10 w-full rounded-md text-left p-1">
                                View Full Profile
                              </button>

                              <hr className="w-full"/>

                              <button className="w-full text-left p-1 rounded-md 
                                text-[#f23f42] hover:bg-[#2b1d1d] cursor-pointer">
                                Ignore
                              </button>

                              <button className="w-full text-left p-1 rounded-md 
                                text-[#f23f42] hover:bg-[#2b1d1d] cursor-pointer">
                                Report User Profile
                              </button>

                              <hr className="w-full"/>

                              <button className="cursor-pointer 
                                hover:bg-white/10 w-full rounded-md text-left p-1">
                                Copy User ID
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      }
      
      
      {
        createChannelModal && (
          <div className='fixed inset-0 bg-black/80  z-50 
          flex items-center justify-center'
          ref={createChannelRef}
          >
            <CreateChannelModal 
              closeModal={handleCreateChannelModal}
              categoryName={categoryName}
              selectedCategoryId={categoryId || ""}
            />
          </div>
        )
      }
      {
        openInviteModal && (
          <div className='fixed inset-0 bg-black/80  z-50 
          flex items-center justify-center'>
            <InviteToServer 
              closeModal={() => setInviteModal(false)}
              channelObj={selectedChannel}
              serverName={server?.serverName || ""}
              serverCode={serverChannels?.serverInviteCode}
            />
          </div>
        )
      }
      {
        createCategoryModal && (
          <div className="fixed inset-0 bg-black/80  z-50 
          flex items-center justify-center">
            <CreateCategoryModal 
              closeModal={() => setCreateCategoryModal(false)}
            />
          </div>
        )
      }

      {
        openServerSettings && (
          <div className="fixed inset-0 h-full w-full z-99">
            <ServerSettings 
              closeModal={() => setOpenServerSettings(
                !openServerSettings
              )}
              serverName={serverChannels?.serverName || "Server"}
            />
          </div>
        )
      }

      {
        openChannelSettings && (
          <div className="fixed inset-0 h-full w-full z-99">
            <ChannelSettings 
              closeModal={() => {
                setOpenChannelSettings(!openChannelSettings)
              }}
              onChannelDelete={selectOnChannelDelete}
              channelId={activeChannel || ""}
              channelName={selectedChannel?.channelName || ""}
              categoryName={categoryName || ""}
            />
          </div>
        )
      }

      {
        openCategorySettings && (
          <div className="fixed inset-0 h-full w-full z-99">
            <CategorySettings 
              categoryName={categoryName}
              categoryId={categoryId || ""}
              closeModal={() => {
                setOpenCategorySettings(false)
                setCategoryName("")
                setCategoryId("")
              }}
            />
          </div>
        )
      }
      {
        openChannelTopic && (
          <div className="fixed inset-0 h-full w-full bg-black/60 z-99 shadow-2xl
            flex items-center justify-center">

            <div className="w-120 h-50 bg-[#2B2D31] p-6 absolute rounded-md text-white text-2xl">
              <div className="flex items-center justify-between w-full font-semibold">

                <div>
                  <p>Channel Topic</p>
                  <p className="flex items-center text-gray-400 gap-2 text-lg">
                    {iconMap[selectedChannel?.icon as keyof typeof iconMap]}
                    {selectedChannel?.channelName}
                  </p>
                </div>
                
                <CgClose 
                  className="cursor-pointer mb-8"
                  onClick={() => setOpenChannelTopic(false)}
                />
              </div>

              <div className="mt-12">
                {selectedChannel?.channelTopic}
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ServerComponents