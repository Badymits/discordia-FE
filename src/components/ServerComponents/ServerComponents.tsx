import { useContext, useState, useRef, useEffect, type ChangeEvent } from "react";
import { ServerContext, useServerContext } from "../../context/ServerContext";
import { useParams } from "react-router-dom";
import { v4 as uuidv4, type UUIDTypes } from "uuid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AiOutlineUsergroupAdd, AiOutlineAudioMuted } from "react-icons/ai";
import { RiArrowDownSLine, RiFileUploadLine } from "react-icons/ri";
import { RiHashtag, RiDeleteBinLine  } from "react-icons/ri";
import { CiSettings } from 'react-icons/ci'
import { IoMdAdd, IoMdAddCircle } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { FaSearch, FaEllipsisH, FaFolderPlus } from "react-icons/fa";
import { TiPin } from "react-icons/ti";
import { GiFilmSpool } from "react-icons/gi";
import { FiPlus } from "react-icons/fi";
import { 
  IoIosNotifications,
  //IoIosNotificationsOff 
} from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { HiHashtag, HiLockClosed, HiUsers } from "react-icons/hi";
import { BsArrow90DegLeft, BsDiscord } from "react-icons/bs";
import { BsArrow90DegRight } from "react-icons/bs";
import { PiSpeakerSimpleHighLight } from "react-icons/pi";

import  { voiceChannelMembers } from "../../utils/DummyData";
import CreateChannelModal from "../ServerComponents/CreateChannelModal";
import InviteToServer from "../InviteToServer";
import CreateCategoryModal from "./CreateCategoryModal";
import type { 
  Category, 
  Channel, 
  Message, 
  MessageFileState,
  ServerMembers 
} from "../../types/ServerTypes";

import { useCurrentUser } from "../../context/UserContext";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { 
  fetchChannel, 
  fetchMessages, 
  fetchServer, 
} from "../../query/serverQueries";
import { uploadImage } from "../../services/serverService";
import ServerSettings from "./ServerSettings";

interface PayloadTest{
  formData: FormData;
  messageId: string;
}

// Declaring message formatter once only since its rendered outside component
const messageDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
})


const ServerComponents = () => {

  const queryClient = useQueryClient();

  const [activeChannel, setActiveChannel] = useState<string>()
  const [showMemberList, setShowMemberList] = useState<boolean>(false)
  const [openMemberSetting, setOpenMemberSetting] = useState<boolean>(false)

  const [createChannelModal, setCreateChannelModal] = useState<boolean>(false)
  const [openInviteModal, setInviteModal] = useState<boolean>(false)
  const [createCategoryModal, setCreateCategoryModal] = useState<boolean>(false)
  const [openServerSettingsPanel, setOpenServerSettingsPanel] = useState<boolean>(false)
  const [openServerSettings, setOpenServerSettings] = useState<boolean>(false)

  const [sectionName, setSectionName] = useState<string>("")
  const [categoryId, setCategoryId] = useState<string | undefined>("")
  const [messageOptionsPanel, setMessageOptionsPanel] = useState(false)

  const [imgList, setImgList] = useState<MessageFileState[]>([])

  const { 
    isInVoice,
    setIsInVoice,
    setJoinedVoiceChannel
  } = useCurrentUser();

  const { 
    send,
    subscribe, 
    unsubscribe,
    isConnected
  } = useWebSocketContext()

  const { 
    serverMembers
  } = useServerContext()

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
    enabled: !!serverId
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

  
  const {data: channelMessages} = useQuery({
    ...fetchMessages(
      activeChannel ?? ""
    ),
    enabled: !!activeChannel,
    staleTime: 1000 * 60 * 5,
  })

  const {
      mutateAsync: uploadImageMutation,
      isPending,
      variables: mutatedVariable,
      reset
    } = useMutation({

    mutationKey: ["uploadImage"],
    mutationFn: async({formData, messageId}: PayloadTest) => await uploadImage(formData, messageId),

    onMutate: async (messageData) => {
      console.log(messageData)

      await queryClient.cancelQueries({queryKey: ["channelMessages", activeChannel]})

      const messages = queryClient.getQueryData(["channelMessages", activeChannel])

      let fileUrl = "";

      const imageFile = messageData.formData.get("image");

      if (imageFile instanceof File) {
        fileUrl = URL.createObjectURL(imageFile);
      }

      queryClient.setQueryData(["channelMessages", activeChannel], (messages: Message[]) => {
        if (!messages) return [];

        return messages.map((msg) => 
          msg.messageId === messageData.messageId
          ? {...msg, messageImgUrl: fileUrl}
          : msg
        )
      })
      return { messages, fileUrl }
    },

    // prefix unused params with underscore to remove ESlint warnings
    onError: (_error, _variables, context)=> {
      queryClient.setQueryData(["channelMessages", activeChannel], context?.messages)
    },

    onSuccess: (response, _variables, context) => {
      console.log(response)

      // remove from browser storage to prevent memory leak 
      if (context?.fileUrl) {
        URL.revokeObjectURL(context.fileUrl);
      }

      // replace optimized update with the actual URL created in the backend
      queryClient.setQueryData(["channelMessages", activeChannel], (messages: Message[]) => {
        if (!messages) return [];

        return messages.map((msg) => 
          msg.messageId === response.messageId
          ? {...msg, messageImgUrl: response.messageImgUrl}
          : msg
        )
      })

      // returns mutattion to idle state
      reset();
    },
  })

  console.log("the channel: ", selectedChannel)
  console.log("Fetched messages from query: ", channelMessages)


  console.log({
      ID_CHECK: serverId,
      QUERY_STATUS: status, // 'pending', 'error', or 'success'
      NETWORK_STATUS: fetchStatus, // 'fetching', 'paused', or 'idle'
      RAW_DATA: serverChannels
  });

  const [serverMemberDetails, setServerMemberDetails] = useState<ServerMembers>({
    id: "",
    user: "",
    displayName: "",
    userName: "",
    userTag: "",
    avatar: ""
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUser, setCurrentUser] = useState<ServerMembers>(() => {
    const userObj = sessionStorage.getItem("UserObj")
    const user = userObj ? JSON.parse(userObj) : null
    
    // just returning random user with default values
    if (user === null) return {
      id: "100",
      user: "user",
      displayName: "display name user",
      userName: "userName",
      userTag: "userTag",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=100"
    }
    
    return {
      id: user.userId,
      user: user,
      displayName: user.displayname,
      userName: user.userName,
      userTag: user.username,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=45",

    }
  })

  const [sampleVoiceChannelMembers, 
    setSampleVoiceChannelMembers] = useState<ServerMembers[]>(voiceChannelMembers)

  const createChannelRef = useRef<HTMLDivElement>(null)
  const latestMessage = useRef<HTMLDivElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  // Side panel that contains server member details 
  const memberPanel = useRef<HTMLDivElement>(null!)

  // Panel for settings such as "View Full Profile, Ignore, Report, and Copy User ID"
  const memberPanelSetting = useRef<HTMLDivElement>(null!)

  const serverSettingsPanel = useRef<HTMLDivElement>(null!)

  const messageInputRef = useRef<HTMLInputElement>(null)

  // on channel change, automatically position view to latest message of channel
  const scrollToBottom = () => {
    latestMessage.current?.scrollIntoView({ behavior: "auto" }); 
  };

  const handleInputFileRefClick = () => {
    if (!inputFileRef.current) return;
    inputFileRef.current.click();
  }

  const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files?.[0]) return;

    const files = e.target.files;

    // 1st safety check if theres no file inside the event target
    if (!files || files.length === 0){
      console.log("No file detected!")
      return;
    }

    const file = files[0];

    // disallow any type of file (for now)
    if (!file.type.startsWith("image/")){
      console.log("Only Image is accepted!")
      return;
    }

    const maxSize = 5 * 1024 * 1024 // 5MB size
    if (file.size > maxSize){
      console.log("Image too large! Limit size is 5MB only!")
      return;
    }

    const objectUrl = URL.createObjectURL(file)

    console.log("file: ", file)


    setImgList((prev) => [
      ...prev,
      {
        id: uuidv4(),
        fileName: file.name,
        objectURL: objectUrl,
        entity: file
      }
    ])
    setMessageOptionsPanel(false)

  }

  const removeImgFromList = (id: UUIDTypes) => {
    if (!id){
      return;
    }

    const imageToRemove = imgList.find(img => img.id === id);
  
    if (imageToRemove) {
      //  remove from memory in browser's storage
      URL.revokeObjectURL(imageToRemove.objectURL);
    }

    const filteredImgList = 
      imgList.filter(img => img.id !== id)

    setImgList(filteredImgList)
  }


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

  

  const formatDateTimestamp = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString)
    return messageDateFormatter.format(date).replace(",", "");
  }

  const formatTimeStamp = (isoString: string) => {
    const date = new Date(isoString).getTime();
    return timeFormatter.format(date)
  } 

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
    const handleMemberPanelClick = (event: MouseEvent) => {
      if ((memberPanel.current && 
            !memberPanel.current.contains(event.target as Node)) ||
          (memberPanelSetting.current 
            && memberPanelSetting.current.contains(event.target as Node))) {
        setServerMemberDetails({
          id: "0",
          user: "",
          displayName: "",
          userName:"",
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

    const handleServerSettingsPanelClick = (event:MouseEvent) => {
      if (serverSettingsPanel.current && 
          !serverSettingsPanel.current.contains(event.target as Node)){
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
    scrollToBottom();
  }, [
    channelMessages, 
    activeChannel,
    imgList.length
  ]); // Ititrigger to pag nagbago ang messages O ang channel ID

  useEffect(() => {

    const handleLeaveVoice = () => {
      setSampleVoiceChannelMembers((prev) => 
        prev.filter((member) => member.id !== currentUser.id)
      )
    }

    // onclick (in Layout.tsx)
    if (isInVoice === false){
      handleLeaveVoice()
    }
    
  }, [isInVoice, currentUser.id])



  useEffect(() => {

    if (!serverId || !selectedChannel || !activeChannel) return;

    const formatMessage = (message: Message) => {

      const formattedDate = 
        new Date(message.dateTimestamp || Date.now()).toISOString();

      
      const newMessageObj: Message = {
        serverId: message.serverId,
        messageId: message.messageId,
        displayName: message.displayName,
        message: message.message,
        userAvatar: message.userAvatar,
        dateTimestamp: formattedDate,
        userId: message.userId,
        channelId: activeChannel,
        messageImgUrl: message.messageImgUrl || "",
        isContentWithImg: message.isContentWithImg
      }

      if (newMessageObj.isContentWithImg && 
          message.userId === currentUser.id && 
          message.messageId)
        {
        console.log("Message w/ img detected. ")
        handleUploadImage(message.messageId)
      } 

      return newMessageObj
    }

    const checkAndSubscribe = setInterval(() => {
      subscribe(`/topic/${serverId}/${activeChannel}`, (rawMessage) => {
        console.log("received message: ", rawMessage)

        const message = formatMessage(rawMessage)

        console.log("Formatted message: ", message)
        queryClient.setQueryData(
          ["channelMessages", activeChannel], (oldMessages: Message[]) => {
          
          // filter messages in the spread operator to prevent double messages from sending.
          // this is to ensure that the setQueryData located in uploadImageMutation pushes through 
          // without disrupting this process.
          return [...oldMessages.filter(m => m.messageId !== message.messageId), message]; // then append new message at the end
          
        })
      })
      clearInterval(checkAndSubscribe);
    }, 100)

    return () => {
      clearInterval(checkAndSubscribe)
      unsubscribe(`/topic/${serverId}/${activeChannel}`)
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
      serverId, 
      selectedChannel,
      subscribe,
      activeChannel,
      imgList
    ]
  );

  // handles two set states instead of setting both in onClick attribute
  const handleSetActiveChannelAndVoiceChannel = (
    activeChannel: string, 
    channelType: string 
  ) => {
    const isAlreadyInVoice = sampleVoiceChannelMembers.some(
      (member) => member.id === currentUser.id
    );

    // useful when switching channels (will add members and messages here as well)
    setActiveChannel(activeChannel)

    if (channelType === "voice" && !isAlreadyInVoice){
      addMemberToVoiceChannel(
        currentUser,
        selectedChannel
      )
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

  const addMemberToVoiceChannel = (
      member: ServerMembers, 
      channel: Channel
    ) => {

    // updates list of members that are in the voice channel
    setSampleVoiceChannelMembers(prev => [...prev, member])

    // calling user context setState to for (lower left) user panel to update UI
    setIsInVoice(true) 

    // values will be used in User Profile (lower left panel) when joining voice channel
    setJoinedVoiceChannel({
      channelId: channel.channelId,
      channelName: channel.channelName,
      serverName: serverChannels.serverName || ""
    })
  }

  const sendMessage = async (e: React.SubmitEvent<HTMLFormElement>) => {

    e.preventDefault();
    console.log("Message Received: ", messageInputRef.current)

    if (
      !isConnected.current || 
      !currentUser ||
      !serverId ||
      !activeChannel || 
      messageInputRef.current?.value === undefined
    ) return


    //let uploadedImageUrl = "";

    const messageBody: Message = {
      serverId: serverId,
      channelId: activeChannel,
      userId: currentUser.id,
      displayName: currentUser.displayName,
      message: messageInputRef.current.value,
      isContentWithImg: imgList.length >= 1
    }

    console.log("testing payload: ", messageBody)

    // WS endpoint configured in backend
    send(`/discordia/sendMessage`, messageBody)
    messageInputRef.current.value = ""
  }

  const handleUploadImage = (messageId: string) => {

    const formData = new FormData();

    if (imgList.length === 0 || !serverId || !activeChannel){
      return null;
    }

    // image file type is multipart/file, which was set in the serverServices file
    imgList.forEach((img) => {
      if (img.entity){
        formData.append("image", img.entity)
      }
    })

    // need to tell the backend that they will receive a JSON type for these fields
    formData.append("serverId", new Blob([JSON.stringify(serverId)], 
      {
        type: "application/json"
      }
    ))

    formData.append("channelId", new Blob([JSON.stringify(activeChannel)],
      {
        type: "application/json"
      }
    ))

    
    try {
      // immediately clear images list to clean up UI images list
      //  in the text input container
      setImgList([])

      uploadImageMutation({formData, messageId});

    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  }

  const compareMessageDate = (prevMsg: Message, currentMsg: Message) => {

    if (!prevMsg.dateTimestamp || !currentMsg.dateTimestamp) return;

    // calculates numbers instead and is much cheaper compared to prev setup 
    // (I converted it to date -> string then back to date then string lmao)
    const difference = Math.abs(
      new Date(currentMsg.dateTimestamp).getTime() - 
      new Date(prevMsg.dateTimestamp).getTime()) > 60000;


    // if greater than 1 min then return true, else false
    return difference
  }

  // console.log("activated channel No: ", activeChannel)
  // console.log("selected server channels: ", serverChannels)
  console.log("Img list container: ", imgList.length)

  if (isLoading){
    return <div className="flex h-screen items-center justify-center">Loading Server...</div>;
  }

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
                rounded-lg shadow-2xl text-[14px] font-bold text-[#DBDEE1] "
                ref={serverSettingsPanel}
                >
                {serverSettings.map((setting, i) => (
                  <div key={i}
                      className="p-1 flex items-center justify-between 
                      gap-18 hover:bg-white/5 m-2 rounded-md cursor-pointer"
                      onClick={() => {
                        handleSettingToggle(setting.value)
                        setOpenServerSettingsPanel(false)
                        //setOpenServerSettings(true)
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
        <div className="flex flex-col py-5 px-1 text-[#949BA4]">
          {
            (serverChannels.serverCategories || []).map((list: Category, i: number) => (
              <div key={i}>
                <div className="">

                  {/* Channel Section Name and Icons */}
                  <div className="pt-2 text-[14px] pl-1 flex justify-between
                    items-center cursor-pointer hover:text-[#DBDEE1] group">

                    <div className="flex items-center gap-1">
                      {list.categoryName}
                      <RiArrowDownSLine 
                        className="group-hover:-rotate-90 duration-150"/>
                    </div>
                    
                    {/* Should only be visible if server owner */}
                    <IoMdAdd 
                      className="mr-2 text-[16px]"
                      data-tooltip-id="create-channel"
                      data-tooltip-content="Create Channel"
                      onClick={() => {
                        setCreateChannelModal(true)
                        setCategoryId(list.categoryId)
                        setSectionName(list.categoryName)
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
                            <div key={member.id}>
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
      
      {
        selectedChannel?.channelType === "voice" ?
        <div className="bg-[#111118] h-full w-full relative">
          <div className={`grid grid-col gap-4 grid-cols-2 
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
            {
              sampleVoiceChannelMembers.map((member) => (
                <div key={member.id} className="bg-gray-500 rounded-lg p-10 
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
                  onClick={() => 
                    addMemberToVoiceChannel(currentUser, selectedChannel)
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
          <div className="bg-[#23272a] flex flex-col flex-1 border-r 
            border-[#363c41] text-[#DBDEE1] h-screen overflow-hidden">
            
            {/* Chat container header Icons/Options */}
            <div className=" border-b border-[#363c41] w-full p-2.75">

              <div className="flex items-center justify-between">
                <div className="font-semibold flex items-center gap-1">
                  {iconMap[selectedChannel?.icon as keyof typeof iconMap]}
                  {selectedChannel?.channelName}
                </div>

                <div className="flex items-center text-2xl gap-6">

                  <IoIosNotifications className="cursor-pointer"/>
                  <GiFilmSpool className="cursor-pointer"/>
                  <TiPin className="cursor-pointer"/>
                  <HiUsers 
                    data-tooltip-id="members"
                    data-tooltip-content={
                      showMemberList ? "Hide member list" : "Show member list"
                    }
                    onClick={() => setShowMemberList(!showMemberList)}
                    className="cursor-pointer hover:bg-white/5 rounded-full"
                  />
                </div>
              </div>

              <Tooltip id="members" place="bottom" className="z-50"/>
            </div>


            <div className="flex-1 flex flex-col w-full min-h-0 overflow-hidden">

              {/* Chat container */}
              <div className="flex-1 overflow-y-auto  scrollbar-thin scrollbar-thumb-[#1e1f22] 
                scrollbar-track-transparent hover:scrollbar-thumb-[#a1a1a1]">
                  
                <div className="h-full flex flex-col justify-end p-4">
                  <p className="text-7xl bg-white/10 w-18 rounded-full">
                    {iconMap[selectedChannel?.icon as keyof typeof iconMap]}
                  </p>

                  <p className="text-4xl py-2 font-bold">Welcome to #{selectedChannel?.channelName}!</p>
                  <p>This is the start of the #{selectedChannel?.channelName} channel.</p>

                  <button 
                    type="button"
                    className="bg-[#383a40] hover:bg-[#2e3035] text-white w-35 
                    flex items-center justify-center gap-2
                    my-2 py-2 rounded-lg cursor-pointer">
                    <MdModeEdit />
                    Edit Channel
                  </button>
                </div>

                {
                  channelMessages?.length > 1 && (
                    <hr className={`border border-[#363c41] mb-5 mx-4`}></hr>
                  )
                }
                
                {/* Messages render area */}

                {
                  isLoading && (
                    <div>
                      Loading lmao
                    </div>
                  )
                }

                {/* renders when there are actual messages sent from BE and
                  when messages that belong to the channel selected */}
                {
                  (
                    (!isLoading &&
                    channelMessages?.length > 0 &&
                    channelMessages[0].channelId === selectedChannel?.channelId) &&
                    (
                      channelMessages.map((message: Message, i: number, channelMessages: Message[]) => {

                        // check if its the very first message in channel.
                        // if yes set value, else set null
                        const prevMsg = i > 0 ? channelMessages[i - 1] : null;

                        const isFirstMessage = i === 0;
                        const isNewUser = prevMsg?.userId !== message.userId;

                        let isOneMinApart;

                        if (prevMsg){
                          isOneMinApart = compareMessageDate(prevMsg, message)
                        }
                        
                        // Master condition
                        const shouldShowHeader = isFirstMessage || isNewUser || isOneMinApart;

                        return(
                          <div
                            key={message.messageId}
                            className={`flex group relative ${shouldShowHeader && "mt-5"}`}
                            >
                              {/* white background when hovering the content */}
                              <div className={`flex items-center gap-2 group-hover:bg-white/10 
                                w-full px-4`}>
                                
                                {/* User Avatar */}
                                {
                                  shouldShowHeader ?
                                  <div className="relative place-self-start pt-1 ">
                                    {message.userAvatar === ""
                                      ? <BsDiscord className="w-10 h-10 p-1 bg-indigo-500 rounded-full"/>
                                      : <img 
                                          src={message.userAvatar}
                                          alt={message.displayName}
                                          className="w-10 h-10 rounded-full object-cover bg-gray-800" 
                                        />
                                    }
                                      {/* member status */}
                                      <span className="bg-green-400 h-2 w-2 absolute bottom-0 
                                        left-7 rounded-full">
                                      </span>
                                  </div>

                                  : <div className="opacity-0 group-hover:opacity-100 m-1 pr-1 text-xs text-gray-400">
                                      {formatTimeStamp(message.dateTimestamp || "")}
                                    </div>
                                }
                                
                                
                                <div className="block">
                                  {/* Display name and date time stamp */}
                                  { 
                                   shouldShowHeader &&
                                    <p className="text-white ">
                                      <span className="font-semibold">{message.displayName}</span>&nbsp;
                                      <span className="font-medium text-xs text-gray-400">
                                        {formatDateTimestamp(message.dateTimestamp || "")}
                                      </span>
                                    </p>
                                  }
                                  <p className={`font-semibold 
                                    ${message.isContentWithImg && "pb-1"}`}>
                                    {message.message}
                                  </p>

                                  {/* UI Animation loader for new messages with images */}
                                  {
                                    isPending &&
                                    mutatedVariable.messageId === message.messageId &&
                                    <div className="w-105 h-70 bg-gray-800 animate-pulse rounded-xl relative">
                                      <div className="w-8 h-8 border-4 border-blue-500 absolute top-1/2 left-1/2
                                        transform -translate-1/2 -translate-y-1/2 border-t-transparent 
                                        rounded-full animate-spin">
                                      </div>
                                    </div>
                                  }

                                  {
                                    message.isContentWithImg &&
                                    mutatedVariable?.messageId !== message.messageId && (
                                      <div>
                                        <img 
                                          src={message.messageImgUrl} 
                                          alt={message.displayName}
                                          className="w-full max-w-105 max-h-96 rounded-lg mb-1.5" 
                                        />
                                      </div>
                                    )
                                  }
                                </div> 
                                
                                {/* Message Options */}
                                <div className="absolute -top-4 right-4 bg-[#2B2D31] 
                                  text-lg flex items-center gap-2 p-1 opacity-0 
                                  group-hover:opacity-100 rounded-md shadow-2x">

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
                                <Tooltip id="message-more" place="left" className="z-50"/>
                              </div>
                          </div>
                        )
                      })
                    )
                  )
                }

                {/* When opening channel, for now, it will always show the latest message of the channel
                not the default one where the user left of */}
                <div ref={latestMessage} />
              </div>
              
              {/* message input tag */}
              <div className="p-4 flex-none relative">
                
                {/* Image/s containers */}
                <div className={`bg-[#383a40] rounded-lg p-2 flex flex-col items-start 
                  justify-center relative`}>
                  
                  <div className="flex gap-5 items-center">
                    {
                      imgList?.length > 0 && (
                        imgList?.map((img, i) => (
                          <div key={i} className="h-50 w-45 bg-[#202122] rounded-lg 
                          relative flex flex-col items-center">
                            <img 
                              key={i}
                              src={img.objectURL}
                              alt={img.fileName} 
                              className="h-[80%] w-[80%] rounded-md m-auto bg-gray-600 object-cover"
                            />

                            <div className="absolute -top-2 -right-2 z-50">
                              <RiDeleteBinLine className="text-red-500 cursor-pointer 
                              bg-[#212327] text-2xl rounded-md "
                                data-tooltip-id="delete-message-file"
                                data-tooltip-content="delete file"
                                onClick={() => removeImgFromList(img.id)}
                              />
                            </div>

                            <p className="font-light pb-1 truncate w-40">{img.fileName}</p>
                          </div>
                        ))
                      )
                    }
                  </div>
                  

                  <div className="flex items-center relative w-full">
                    <form action="" onSubmit={sendMessage} className="w-full">
                      {/* <input 
                        type="text" 
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={`Message #${selectedChannel?.channelName}`}
                        className="bg-transparent w-full pl-8 py-3 focus:outline-0"
                      /> */}
                      <input 
                        type="text" 
                        ref={messageInputRef}
                        placeholder={`Message #${selectedChannel?.channelName}`}
                        className="bg-transparent w-full pl-9 py-3 focus:outline-0"
                      />
                    </form>

                    <FiPlus className="absolute top-2.5 text-3xl p-1 
                      hover:bg-white/20 rounded-lg cursor-pointer duration-400"
                      onClick={() => setMessageOptionsPanel(!messageOptionsPanel)}
                    />
                  </div>
                  <Tooltip id="delete-message-file" place="top"/>
                  
                </div>

                {
                  messageOptionsPanel && (
                    <div className="absolute bottom-15 left-8 bg-[#181d22] 
                      shadow-xl p-3 border-[#363c41] border rounded-lg">

                      <button 
                        type="button"
                        onClick={handleInputFileRefClick}
                        className="hover:bg-white/10 p-1 px-2 rounded-lg cursor-pointer">
                        <RiFileUploadLine className="inline-flex mb-1 mr-2"/>
                        Upload a File
                      </button>
                    </div>
                  )
                }
                <input 
                  type="file"
                  ref={inputFileRef}
                  onChange={(e) => {
                    handleImageInput(e)
                  }}
                  accept="image/*"
                  className="hidden" 
                />
                
              </div>
            </div>
          </div>
          
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
              Online - {serverMembers?.length}
            </p>
            
            {
              (serverMembers || []).map((member: ServerMembers) => (
                <div 
                  key={member.id}
                  >
                  <div className="relative">

                    {/* Member list  */}
                    <div 
                      className="flex items-center gap-2 py-1.5 
                      hover:bg-white/10 px-1.5 rounded-md cursor-pointer relative"
                      onClick={() => setServerMemberDetails({
                        id: member.id,
                        user: member.user,
                        userName: member.userName,
                        displayName: member.displayName,
                        userTag: member.userTag,
                        avatar: member.avatar
                      })}>

                      <img 
                          src={member.avatar} 
                          alt={member.user} 
                          className="w-8 h-8 rounded-full bg-gray-500" 
                        />
                      {member.user}

                      <span className="bg-green-400 h-2 w-2 absolute bottom-1 
                      left-7 rounded-full"></span>
                    </div>
                    
                    {/* Server member details panel */}
                    {serverMemberDetails.id === member.id && (
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
                              <img 
                                src={serverMemberDetails.avatar} 
                                alt={serverMemberDetails.user} 
                                className="h-24 w-24 -mt-12  rounded-full
                                border-6 border-[#232428] bg-gray-600"
                              />

                              <p className="text-lg font-semibold">
                                {serverMemberDetails.user}
                              </p>

                              <p className="text-sm">
                                {serverMemberDetails.userTag}
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
                                placeholder={`Message @${serverMemberDetails.user}`}
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
              sectionName={sectionName}
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
    </div>
  )
}

export default ServerComponents