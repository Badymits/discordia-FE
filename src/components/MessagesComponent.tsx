import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'

import { 
  useMutation, 
  useQuery, 
  useQueryClient 
} from '@tanstack/react-query'
import { v4 as uuidv4, type UUIDTypes } from "uuid";

import { useWebSocketContext } from '../context/WebSocketContext'
import { 
  addMemberToServer,
  deleteDirectMessage,
  deleteServerMessage,
  getDirectMessages, 
  getServerMessagesByChannelId, 
  getServerMetaData, 
  updateMessage, 
  uploadImage 
} from '../services/serverService'

import type {  
  ConversationContext, 
  DirectMessage, 
  JoinServerMutate, 
  MessageFileState, 
  PayloadRawMessage, 
  ReplyMessage, 
  ServerMemberPayload, 
  ServerMessage 
} from '../types/ServerTypes'
import type { ServerUser } from '../types/User'
import { formatDateTimestamp, formatTimeStamp } from '../utils/FormatDateValues'


import { BsArrow90DegLeft, BsArrow90DegRight, BsDiscord } from 'react-icons/bs'
import { FaEllipsisH, FaRegImage } from 'react-icons/fa'
import { RiDeleteBinLine, RiFileUploadLine, RiHashtag } from 'react-icons/ri'
import { PiSpeakerSimpleHighLight } from 'react-icons/pi'
import { HiHashtag, HiLockClosed } from 'react-icons/hi'
import { IoIosNotifications, IoMdCloseCircleOutline } from 'react-icons/io'
import { GiFilmSpool } from 'react-icons/gi'
import { TiArrowBack, TiPin } from 'react-icons/ti'
import { MdModeEdit } from 'react-icons/md'
import { FiPlus } from 'react-icons/fi'
import { CgClose } from "react-icons/cg";


interface MessageComponentProps{
  messageType: string;
  userRecipientDetails?: ServerUser;
  conversationDetails: ConversationContext;
  channelId: string;
  currentUser: ServerUser;
  key: string;
}

type PayloadData = Partial<ServerMessage> & {
  formData: FormData;
  messageId: string;
}

interface TContext{
  fileUrl: string;
  messages: ServerMessage | unknown;
}

interface UpdateMessageContext{
  messageToUpdate: ServerMessage | DirectMessage |unknown
}

type MessageMutation = (ServerMessage | DirectMessage) & { 
  allowEdit?: boolean;
  allowDelete?: boolean;
};

interface UpdateMessage {
  messageId: string;
  message: string;
}


interface ServerMetaData{
  serverId: string;
  channelId: string;

  serverName: string;
  serverIcon: string;
  serverInviteCode: string;

  createdDate: string;
  serverMemberCount: number;
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

const iconMap = {
  "hash": <RiHashtag />,
  "text": <RiHashtag />,
  "voice": <PiSpeakerSimpleHighLight className="text-xl"/>,
  "lock": LockedChannelIcon()
}

const MessagesComponent = ({
  messageType,
  userRecipientDetails,
  conversationDetails,
  channelId,
  currentUser,
}: MessageComponentProps) => {  

  const queryClient = useQueryClient();
  const { 
    send, 
    subscribe, 
    unsubscribe, 
    isConnected, 
    socketConnection, 
    setActiveRoom 
  } = useWebSocketContext()

  const { serverId, directChannelId } = useParams();
  const navigate = useNavigate();

  const [imgList, setImgList] = useState<MessageFileState[]>([]);
  const [replyMessageObject, setReplyMessageObject] = useState<ReplyMessage>({
    messageId: "",
    message: "",
    userId: "",
    displayName: "",
    imgUrl: "",
    isContentWithImg: false
  })

  const [copiedServerId, setCopiedServerId] = useState<string>();

  //  this will be used when clicking the message options panel
  const [messageToMutate, setMessageToMutate] = useState<MessageMutation | undefined>(undefined);   

  const [messageOptionsPanel, setMessageOptionsPanel] = useState<boolean>(false)
  const [fileAttachementPanel, setFileAttachmentPanel] = useState<boolean>(false);

  const [panelCoords, setPanelCoords] = useState({x: 0, y: 0})

  const messageInputRef = useRef<HTMLInputElement>(null);
  const editMessageInputRef = useRef<HTMLInputElement>(null)

  const fileInputRef = useRef<HTMLInputElement>(null);
  const latestMessage = useRef<HTMLDivElement>(null);
  const replyMessageRef = useRef<HTMLDivElement>(null);

  const imgListRef = useRef(imgList)
  imgListRef.current = imgList

  const queryKeyRef = useRef<string>(messageType === "server" ? "channelMessages" : "directChannelMessages")
  queryKeyRef.current = messageType === "server" ? "channelMessages" : "directChannelMessages"

  const queryIdRef = useRef<string>(messageType === "server" ? channelId : directChannelId)
  queryIdRef.current = messageType === "server" ? channelId : directChannelId

  console.log(queryIdRef.current, queryKeyRef.current)

  const {
    data: channelMessages, 
    isLoading: isLoadingMessages,
  } = useQuery<ServerMessage[] | DirectMessage[], Error>({

    queryKey: serverId
    ? ["channelMessages", channelId]
    : ["directChannelMessages", directChannelId],
    queryFn: async () => {
      if (serverId && channelId){
        return getServerMessagesByChannelId(channelId).then(res => res.data)
      } else if (directChannelId){
        return getDirectMessages(directChannelId).then(res => res.data)
      } else {
        throw new Error("Invalid query state")
      }
    },

    enabled: !!channelId || !!directChannelId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  }) 

  const {
    data: fetchedMetaData,
    isLoading: isLoadingMetaData,
  } = useQuery<ServerMetaData>({
    queryKey: ["serverMetaData"],
    queryFn: () => getServerMetaData(serverId || copiedServerId || "").then(res => {

      console.log(res.data)
      return res.data
    }),
    enabled: !!copiedServerId || !!serverId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  })

  const {
    mutateAsync: uploadImageMutation,
    isPending,
    variables: mutatedVariable,
    reset
  } = useMutation<ServerMessage | DirectMessage, Error, PayloadData, TContext>({
    mutationKey: ["uploadImage"],
    mutationFn: async({formData, messageId}: PayloadData) => await uploadImage(formData, messageId || "", messageType),

    onMutate: async (messageData) => {

      await queryClient.cancelQueries({queryKey: [queryKeyRef.current, queryIdRef.current]})

      const messages = queryClient.getQueryData([queryKeyRef.current, queryIdRef.current])

      let fileUrl = "";

      const imageFile = messageData.formData.get("image");

      if (imageFile instanceof File) {
        fileUrl = URL.createObjectURL(imageFile);
      }

      queryClient.setQueryData([queryKeyRef.current, queryIdRef.current], (messages: ServerMessage[] | DirectMessage[]) => {
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
    onError: (_error, _variables, context) => {
      queryClient.setQueryData([queryKeyRef.current, queryIdRef.current], context?.messages)
    },

    onSuccess: ( response, _variables, context ) => {

      // remove from browser storage to prevent memory leak 
      if (context?.fileUrl) {
        URL.revokeObjectURL(context.fileUrl);
      }

      console.log(response)

      // replace optimized update with the actual URL created in the backend
      queryClient.setQueryData(
        [queryKeyRef.current, queryIdRef.current], (messages: ServerMessage[] | DirectMessage[]) => {

        if (!messages) return [];

        return messages.map((msg) => 
          msg.messageId === response.messageId
          ? {...msg, messageImgUrl: response.messageImgUrl}
          : msg
        )
      })

      // returns mutattion to idle state
      reset();
    }
  })

  const {
    mutateAsync: updateDirectMessageMutation,
    isPending: isUpdateMessagePending,
    variables: mutatedMessageVariable,
    reset: resetUpdateMessageMutation
  } = useMutation<ServerMessage | DirectMessage, Error, UpdateMessage, UpdateMessageContext>({
    mutationKey: serverId ? ["updateServerMessage"] : ["updateDirectMessage"],

    mutationFn: async ({messageId, message}: UpdateMessage) => {
      if (serverId && channelId) {
        return updateMessage(channelId, messageId, message, "server") // I'll change this later
      } else if (directChannelId) {
        console.log("before sending to backend: ", message)
        return updateMessage(directChannelId, messageId, message, "direct")
      } else {
        throw new Error("Cannot Update message")
      }
    },

    onMutate: async (editedMessage) => {

      await queryClient.cancelQueries({queryKey: [queryKeyRef.current, queryIdRef.current]})

      const messageToUpdate = queryClient.getQueryData([queryKeyRef.current, queryIdRef.current])

      queryClient.setQueryData([queryKeyRef.current, queryIdRef.current], (messages: ServerMessage[] | DirectMessage[]) => {
        if (!messages) return []

        const message = messages.find(msg => msg.messageId === editedMessage.messageId)

        console.log("updating message: ", message)

         return messages.map((msg) => 
          msg.messageId === editedMessage.messageId
          ? {...msg, message: editedMessage.message, isEdited: true}
          : msg
        )
      })

      return { messageToUpdate }
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData([queryKeyRef.current, queryIdRef.current], context)
    },

    onSuccess(data) {
      console.log(data)

      queryClient.setQueryData([queryKeyRef.current, queryIdRef.current], (messages: ServerMessage[] | DirectMessage[]) => {
        if (!messages) return [];

        const message = messages.find(msg => msg.messageId === data.messageId)

        if (!message) return messages

         return messages.map((msg) => 
          msg.messageId === message.messageId
          ? {...msg, message: message.message, isEdited: data.isEdited}
          : msg
        )
      })

      setMessageToMutate(undefined)
      if (editMessageInputRef.current){
        editMessageInputRef.current.value =  ""
      }
      
      resetUpdateMessageMutation()
    },
  })

  const {
    mutate: deleteMessageMutation
  } = useMutation({
    mutationKey: serverId ? ["deleteServerMessage"] : ["deleteDirectMessage"],
    mutationFn: async (messageId: string) => {

      if (serverId && channelId){
        return deleteServerMessage(channelId, messageId, serverId)
      } else if (directChannelId){
        return deleteDirectMessage(directChannelId, messageId)
      } else {
        throw new Error("Message/Server/Direct Channel Id not Found")
      }
    },

    onMutate: async (deletedMessageId) => {
      await queryClient.cancelQueries({queryKey: [queryKeyRef.current, queryIdRef.current]})

      const messages = queryClient.getQueryData([queryKeyRef.current, queryIdRef.current])

      if (!messages){
        return;
      }

      queryClient.setQueryData([queryKeyRef.current, queryIdRef.current], (messages: ServerMessage[] | DirectMessage[]) => {
        if (!messages) return [];

        const filteredMessages = messages.filter(msg => msg.messageId !== deletedMessageId)

        return filteredMessages
      })

      return { messages }
    },

    onError: (_data, _variables, context) => {
      queryClient.setQueryData([queryKeyRef.current, queryIdRef.current], context?.messages)
    },

    onSuccess: (response) => {
      console.log(response)

      queryClient.setQueryData([queryKeyRef.current, queryIdRef.current], (messages: ServerMessage[] | DirectMessage[]) => {
        if (!messages) return [];

        return messages.filter(msg => msg.messageId !== response.data.messageId)
      })

      setMessageToMutate(undefined)
    }
  })

  const { mutate: joinServerMutation } = useMutation({
    mutationKey: ["joinServer"],
    mutationFn: async ({member, serverCode, channelId}: JoinServerMutate) => await addMemberToServer(member, serverCode, channelId),
    onSuccess: (data, _variables, _result, context) => {
      console.log(data)
      console.log(context)

      if (!fetchedMetaData){
        console.error("Cannot join server with empty server name or server ID")
        return;
      }

      navigate(`/server/${fetchedMetaData.serverName}/${fetchedMetaData.serverId}`)
    },
    onError: () => {}
  })

  const getInitials = (serverName: string) => {
    return serverName
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  const isUrl = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }   

  const handleMessageOptionsPanel = (
    event: React.MouseEvent<SVGElement>, 
    message: ServerMessage | DirectMessage
  ) => {
    // there are other events in the parent's divs 
    // so we want to prevent that from happening
    event.stopPropagation();


    // set values except the allow Edit field
    setMessageToMutate(message)

    setMessageOptionsPanel(!messageOptionsPanel)
    setPanelCoords({
      x: event.clientX, 
      y: event.clientY
    })
  }

  const handleUpdateMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (messageType === "server" && (!serverId || !channelId)){
      console.log("Cannot update message with missing server ID")
      return;
    }

    if (messageType === "direct" && !directChannelId){
      return;
    }

    if (!editMessageInputRef.current){
      console.log("Edited message missing");
      return;
    }

    if (!messageToMutate){
      console.error("Cannot update with missing ID!")
      return;
    }

    console.log("Message ID to be updated!: ", messageToMutate.messageId)
    console.log("Edited message: ", editMessageInputRef.current.value)

    updateDirectMessageMutation({
      messageId: messageToMutate.messageId || "",
      message:  editMessageInputRef.current.value
    })

    setMessageToMutate(msg => {
      if (!msg) return msg

      return {
        ...msg,
        allowEdit: false
      }
    })
  }

  const handleDeleteMessage = () => {
    if (!messageToMutate){
      console.error("Cannot update an empty message!")
      return;
    }

    if (messageType === "server" && (!serverId || !channelId)){
      console.log("Cannot update message with missing server ID")
      return;
    }

    if (messageType === "direct" && !directChannelId){
      return;
    }

    deleteMessageMutation(messageToMutate.messageId || "")
    setMessageToMutate(msg => {
      if (!msg) return msg

      return {
        ...msg,
        allowDelete: false
      }
    })
  }

  const handlePasteText = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text")

    if (pastedData.includes("::")){
      e.preventDefault();

      const [code, serverId] = pastedData.split("::")
      console.log("Code: ", code)

      if (messageInputRef.current){
        messageInputRef.current.value = code
      }
      setCopiedServerId(serverId)
    }
  }

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {

    if(!e.target.files?.[0]){
      console.error("No Images detected!")
      return;
    }

    const files = e.target.files

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

    setImgList((prev) => [
      ...prev,
      {
        id: uuidv4(),
        fileName: file.name,
        objectURL: objectUrl,
        entity: file
      }
    ])
    setFileAttachmentPanel(false)
    return;
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

  // making the border of the div to be the only clickable area of the div
  const handleReplyThreadClick = (e: React.MouseEvent<HTMLDivElement>) => {

    const div = replyMessageRef.current;

    let rect;
    if (div){
      rect = div.getBoundingClientRect();
      const borderWidth = 32; // Match your CSS border width

      // Calculate click position relative to the div
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check if click is within the border area
      const isClickInBorder =
        clickX < borderWidth ||
        clickY < borderWidth ||
        clickX > rect.width - borderWidth ||
        clickY > rect.height - borderWidth;

      if (isClickInBorder) {
        alert('Border clicked!');
      }
    }
  };
  
  const handleInputFileRefClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }

  // on channel change, automatically position view to latest message of channel
  const scrollToBottom = () => {
    latestMessage.current?.scrollIntoView({ behavior: "auto" }); 
  };

  const handleUploadImage = (messageId: string) => {

    const formData = new FormData();

    if (imgListRef.current.length === 0){
      console.log("Cannot detect any images")
      return;
    }

    if (messageType === "direct" && !directChannelId){
      console.error("Direct Channel Id not detected!")
      return null;
    }

    if (messageType === "server" && ( !serverId || !channelId)){
      console.error("Server Id and/or channel Id not detected!")
      return null;
    }

    // image file type is multipart/file, which was set in the serverServices file
    imgListRef.current.forEach((img) => {
      if (img.entity){
        formData.append("image", img.entity)
      }
    })

    // need to tell the backend that they will receive a JSON type for these fields
    if (messageType === "server"){
      formData.append("channelId", new Blob([JSON.stringify(channelId)],
        {
          type: "application/json"
        }
      ))
    } else {
      
      formData.append("directChannelId", new Blob([JSON.stringify(directChannelId)],
        {
          type: "application/json"
        }
      ))
    }

    try {
      // immediately clear images list to clean up UI images list
      //  in the text input container
      setImgList([])

      uploadImageMutation({formData, messageId});
      console.log("REMOVING IMG LIST!!")

    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  }

  const sendMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPending){
      console.error("Cannot send messages while image is uploading")
      return;
    }

    if (!messageInputRef.current || !isConnected.current || !currentUser){
      console.error("Missing Connection and Message input")
      return;
    }

    if (messageInputRef.current.value.trim() === "" 
        && imgList.length === 0){
      console.error("Cannot send empty messages")
      return;
    }

    if (messageType === "direct" && !directChannelId){
      console.error("Cannot proceed without direct channel id")
      return 
    }

    if (messageType === "server" && (!serverId || !channelId)){
      console.error("Cannot proceed without server, and channel id")
      return;
    }

    let messageBody: ServerMessage | DirectMessage

    //console.log("checking if url is sent: ", isUrl(messageInputRef.current.value))

    if (messageType === "server"){

      messageBody = {
        serverId: serverId || "",
        channelId: channelId || "",
        displayName: currentUser.displayName || "",
        userAvatar: currentUser.imgUrl,
        userId: currentUser.userId,
        message: messageInputRef.current.value,

        isContentWithImg: imgList.length >= 1,
        isReply: !!replyMessageObject.messageId,
        isEdited: false,
        isServerInvite: isUrl(messageInputRef.current.value),
        type: messageType
      }
    
    } else {

      messageBody = {
        serverId:  serverId || "",
        recipientId: userRecipientDetails?.userId || "",
        directChannelId: directChannelId || "",
        displayName: currentUser.displayName || "",
        userId: currentUser.userId,
        message: messageInputRef.current.value,

        isContentWithImg: imgList.length >= 1,
        isReply: !!replyMessageObject.messageId,
        isEdited: false,
        isServerInvite: isUrl(messageInputRef.current.value),
        type: messageType
      }
    }

    console.log("Checking if recipient ID is included: ", messageBody)

    if (replyMessageObject.messageId){
      const repliedToObj: ReplyMessage = replyMessageObject
      messageBody.repliedTo = repliedToObj
    }

    // WS endpoint configured in backend
    const wsEndpoint = messageType === "server" ? "sendMessage" : "sendDirectMessage"

    console.log("CHECKING MESSAGE: ", messageBody)

    send(`/discordia/${wsEndpoint}`, messageBody)
    messageInputRef.current.value = "";
    setReplyMessageObject({
      messageId: "",
      message: "",
      userId: "",
      displayName: "",
      isContentWithImg: false
    })
    
  }

  const compareMessageDate = (
    prevMsg: ServerMessage | DirectMessage, 
    currentMsg: ServerMessage | DirectMessage
  ) => {

    if (!prevMsg.dateTimestamp || !currentMsg.dateTimestamp) return;

    // calculates the numbers set in the date time stamp using Epoch Milliseconds type (ISO 8601 format)
    const difference = Math.abs(
      new Date(prevMsg.dateTimestamp).getTime() - 
      new Date(currentMsg.dateTimestamp).getTime()) > 60000;

    return difference;
  }

  const formatRawMessage = (message: PayloadRawMessage) => {

    if (!message.messageId){
      console.error("Null messages cannot be formatted!")
      return;
    }


    const formattedDate = 
      new Date(message.dateTimestamp || Date.now()).toISOString();

    let formattedMessage: ServerMessage | DirectMessage;

    if (messageType === "server"){
      formattedMessage = {
        messageId: message.messageId,
        serverId: serverId || "",
        channelId: channelId || "",
        userId: message.userId || "",
        displayName: message.displayName || "",
        userAvatar: message.userAvatar || "",

        message: message.message || "",
        messageImgUrl: message.messageImgUrl,
        dateTimestamp: formattedDate,

        isContentWithImg: !!message.isContentWithImg,
        isReply: !!message.isReply,
        isEdited: !!message.isEdited,
        isServerInvite: !!message.isServerInvite,

        type: messageType
      }
    } else {
      formattedMessage = {
        serverId: message.serverId || "",
        messageId: message.messageId,
        recipientId: userRecipientDetails?.userId || "",

        directChannelId: directChannelId || "",
        userId: message.userId || "",
        displayName: message.displayName || "",
        userAvatar: message.userAvatar || "",

        message: message.message || "",
        messageImgUrl: message.messageImgUrl,
        dateTimestamp: formattedDate,

        isContentWithImg: !!message.isContentWithImg,
        isReply: !!message.isReply,
        isEdited: !!message.isEdited,
        isServerInvite: !!message.isServerInvite,

        type: messageType
      }
    }

    if (message.isReply){
      const formattedReply: ReplyMessage = {
        messageId: message.repliedTo?.messageId || "",
        message: message.repliedTo?.message || "",
        userId: message.repliedTo?.userId || "",
        displayName: message.repliedTo?.displayName || "",
        imgUrl: message.repliedTo?.imgUrl,
        isContentWithImg: !!message.repliedTo?.isContentWithImg
      }
      formattedMessage.repliedTo = formattedReply
    }

    if (message.isContentWithImg && message.userId === currentUser.userId){
      console.log("UPLOADING NEW IMAGE!!!")
      handleUploadImage(message.messageId)
    } 

    return formattedMessage;
  }

  const updateEditedMessage = (message: ServerMessage | DirectMessage) => {

    queryClient.setQueryData(
      [queryKeyRef.current, queryIdRef.current], (messages: ServerMessage[] | DirectMessage[]) => {

      if (!messages) return [];

      const updatedMessage = messages.find(msg => msg.messageId === message.messageId);

      if (!updatedMessage){
        console.error("Message Object not found!")
        return;
      }

      console.log(message)

      return messages.map(
        msg => msg.messageId === message.messageId
        ? {...msg, message: message.message, isEdited: message.isEdited}
        : msg
      )
    })
  }

  const appendMessageToChatContainer = (message: ServerMessage | DirectMessage) => {

    queryClient.setQueryData(
      [queryKeyRef.current, queryIdRef.current], (messages: ServerMessage[] | DirectMessage[]) => {

      console.log("old messages: ", messages) 
      console.log("with new mesage: ", message)

      const filteredMessages = (messages || []).filter(msg => msg.messageId !== message.messageId)
      
      return [
        ...filteredMessages,
        message
      ]
    })
  }

  const removeDeletedMessage = (messageId: string) => {

    if (!messageId){
      console.error("Cannot Delete non existent messages from chat")
      return;
    }

    queryClient.setQueryData(
      [queryKeyRef.current, queryIdRef.current], (messages: ServerMessage[] | DirectMessage[]) => {
        
        const newMessages = (messages || []).filter(msg => msg.messageId !== messageId)
        
        // need to ensure that
        return newMessages.map(
          msg => msg.repliedTo?.messageId === messageId
          ? {...msg, repliedTo: null}
          : msg
        )
      }
    )
  }

  const handleJoinServer = (
    serverCode: string,
    channelId: string,
    member: ServerUser,
  ) => {
    console.log("Joining Server...");

    if (!serverCode || !member || !channelId){
      console.error("Cannot join with empty code")
      return;
    }

    console.log("Adding member: ", member)

    const memberObject: ServerMemberPayload = {
      serverNickname: member.displayName,
      userDetails: {
        userId: member.userId,
        username: member.username,
        displayName: member.displayName,
        userBio: member.userBio,
        imgUrl: member.imgUrl,
      }
    }

    console.log(memberObject)

    joinServerMutation({
      member: memberObject,
      serverCode: serverCode,
      channelId: channelId
    })
    
  }

  // Ititrigger to pag nagbago ang messages O ang channel ID
  useEffect(() => {
    scrollToBottom();
  }, [channelMessages, channelId, imgList.length]); 


  useEffect(() => {
    // temporary lang yung isConnected
    if (!currentUser || !socketConnection || !isConnected.current){
      console.error("Waiting for connection....")
      return;
    }

    const urlSubscription = messageType === "server" 
    ? `${serverId}/${channelId}`
    : `${directChannelId}`

    console.log("CHECKING URL SUBSCRIPTION: ", urlSubscription)
    
    subscribe(`/topic/${urlSubscription}`, (rawMessage: PayloadRawMessage) => {
      console.log(rawMessage)

      // for deleted messages, just immediately return;
      if (!rawMessage){
        return;
      }

      if (typeof rawMessage === 'string'){
        removeDeletedMessage(rawMessage);
      }

      const message = formatRawMessage(rawMessage)

      if (!queryKeyRef.current || !queryIdRef.current){
        console.error("Query ID and Query Key not found!");
        return;
      }

      if (!message){
        console.error("Cannot send message. Please try again later")
        return;
      }

      if (message.isServerInvite && message.serverId){
        console.log("Server Invite detected!")
        setCopiedServerId(message.serverId)
      }


      if (message.isEdited){
        updateEditedMessage(message);
      } else {
        appendMessageToChatContainer(message)
      }
    })

    return () => {
      if (socketConnection && isConnected) { 
        unsubscribe(`/topic/${urlSubscription}`);
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, socketConnection])

  useEffect(() => {
    if (serverId && channelId){
      setActiveRoom({ roomId: serverId + " " + channelId, roomType: "server" })
    } else if (directChannelId) {
      setActiveRoom({ roomId: directChannelId, roomType: "direct" })
    } else {
      return;
    }
  }, [serverId, channelId, directChannelId, setActiveRoom])

  
  useEffect(() => {
    if (messageToMutate?.allowEdit && editMessageInputRef.current) {
      editMessageInputRef.current.value = messageToMutate.message;
      editMessageInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      editMessageInputRef.current.focus();
    }
  }, [messageToMutate?.allowEdit, messageToMutate?.message]);

  console.log(channelMessages)
  console.log(editMessageInputRef.current?.value)

  return (
    <div className='bg-[#23272a] flex flex-col flex-1 border-r 
      border-[#363c41] text-[#DBDEE1] h-screen overflow-hidden'>

      {/* Chat container header Icons/Options */}
      <div className='border-b border-[#363c41] w-full p-2.75'>

        <div className='flex items-center justify-between'>
          {
            messageType === "server" 
            ? 
            (
              <div className='font-semibold flex items-center justify-center'>
                <div className="flex items-center">
                  {iconMap[conversationDetails?.icon as keyof typeof iconMap]}
                  {conversationDetails?.conversationName}
                </div>

                {
                  conversationDetails?.conversationTopic && 
                    <span className="h-1 w-1 rounded-full mx-2 bg-gray-600"></span>
                }

                {
                  conversationDetails?.conversationTopic && (
                    <p 
                      //onClick={() => setOpenChannelTopic(true)}
                      className="text-gray-400 text-sm cursor-pointer">
                        {conversationDetails?.conversationTopic}
                    </p>
                  )
                }
              </div>
            )
            : (
              <div className='flex items-center font-semibold'>
                {
                  userRecipientDetails?.imgUrl 
                  ? <img 
                      src={userRecipientDetails?.imgUrl} 
                      alt={userRecipientDetails?.displayName} 
                      className='rounded-full h-8.5 w-8.5 mr-2 object-cover'
                    />
                  : <BsDiscord className='bg-indigo-500 p-1 rounded-full h-8.5 w-8.5 mr-2'/>
                }
                {userRecipientDetails?.displayName}
              </div>
            )
          }
          <div className="flex items-center text-2xl gap-6">
          
            <IoIosNotifications className="cursor-pointer"/>
            <GiFilmSpool className="cursor-pointer"/>
            <TiPin className="cursor-pointer"/>
            {/* <HiUsers 
              data-tooltip-id="members"
              data-tooltip-content={
                showMemberList ? "Hide member list" : "Show member list"
              }
              onClick={() => setShowMemberList(!showMemberList)}
              className="cursor-pointer hover:bg-white/5 rounded-full"
            /> */}
          </div>
        </div>
        <Tooltip id="members" place="bottom" className="z-50"/>
      </div>
      
      {/* Chat container */}
      <div className='flex-1 flex flex-col w-full min-h-0 overflow-hidden'>

        <div className='flex-1 overflow-y-auto  scrollbar-thin scrollbar-thumb-[#1e1f22] 
            scrollbar-track-transparent hover:scrollbar-thumb-[#a1a1a1]'>
          
          <div className='h-full flex flex-col justify-end p-4'>
            { serverId 
              ? <div>
                  <p className="text-7xl bg-white/10 w-18 rounded-full">
                    {iconMap[conversationDetails?.icon as keyof typeof iconMap]}
                  </p>

                  <p className="text-4xl py-2 font-bold">
                    Welcome to #{conversationDetails?.conversationName}!
                  </p>
                  <p>This is the start of the #{conversationDetails?.conversationName} channel.</p>

                  <button 
                    type="button"
                    className="bg-[#383a40] hover:bg-[#2e3035] text-white w-35 
                    flex items-center justify-center gap-2
                    mx-4 my-2 py-2 rounded-lg cursor-pointer">
                    <MdModeEdit />
                    Edit Channel
                  </button>
                </div> 

              : <div className=''>
                  {
                    userRecipientDetails?.imgUrl
                    ? <img 
                        src={userRecipientDetails?.imgUrl} 
                        alt={userRecipientDetails?.displayName}
                        className='h-22 w-22 rounded-full object-cover' 
                      />
                    : <BsDiscord className='bg-indigo-500 h-22 w-22 rounded-full p-2'/>
                  }
                  <p className='text-4xl font-bold my-4'>{userRecipientDetails?.displayName}</p>
                  <p className='text-2xl font-semibold mb-5'>{userRecipientDetails?.username}</p>
                  <p className='text-xl'>This is the beginning of your direct message history with&nbsp; 
                    <span className='font-bold'>{userRecipientDetails?.displayName}</span>
                  </p>

                  <div className='flex items-center gap-2'>
                    <p className='text-sm font-light'>No Servers in Common</p>

                    <button 
                      type="button"
                      className="bg-indigo-500 hover:bg-indigo-400 text-white  
                       my-2 p-2 rounded-lg cursor-pointer duration-150">
                      Add Friend
                    </button>
                    <button 
                      type="button"
                      className="bg-[#383a40] hover:bg-[#2e3035] text-white  
                       my-2 p-2 rounded-lg cursor-pointer duration-150">
                      Block
                    </button>
                    <button 
                      type="button"
                      className="bg-red-500 hover:bg-red-400 text-white  
                       my-2 p-2 rounded-lg cursor-pointer duration-150">
                      Report Spam
                    </button>
                  </div>
                </div>
            }
          </div>
          <hr className={`border border-[#363c41] mx-3 opacity-0 ${!!(channelMessages?.length) && "mb-5 opacity-100"}`}></hr>

          {/* Messages render area */}
          {
            isLoadingMessages && (
              <div className="flex-1 flex flex-col w-full min-h-0 mb-auto overflow-hidden">
                {[...Array(3)].map((_, i) => (
                <div key={i} className="mb-7">
                  <div className="h-5 bg-[#202024] my-2 w-full animate-pulse gap-2 ml-1  rounded-md"></div>
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="h-7 bg-[#202024] my-2  animate-pulse gap-2 mx-4  rounded-md"></div>
                  ))}
                </div>
              ))}
              </div>
            )
          }

          {
            (!isLoadingMessages && !!(channelMessages?.length)) && (
              <div>
                {(channelMessages || []).map((
                    message: ServerMessage | DirectMessage, 
                    i: number,  
                    componentMessages: ServerMessage[] | DirectMessage[]
                  ) => {

                  const prevMessage = i > 0 ? componentMessages[i - 1] : null;
                  const isFirstMsg = i === 0;

                  const isNewUser = prevMessage?.userId !== message.userId

                  let isOneMinApart;

                  if (prevMessage){
                    isOneMinApart = compareMessageDate(prevMessage, message)
                  }

                  // master condition
                  const shouldShowHeader =  
                    isFirstMsg || isNewUser || isOneMinApart || message.isReply

                  return (
                    <div
                        key={message.messageId}
                        className={`flex group relative w-full
                          ${shouldShowHeader && "mt-5"}
                          ${replyMessageObject.messageId === message.messageId &&
                            "bg-[#2b2a5c]/60 border-l-2 border-indigo-400"
                          }  
                        `}
                      > 
                        {/* White Background whe hovering content */}
                        <div 
                          className='flex items-center gap-2 group-hover:bg-white/10 w-full 
                          px-4 relative'
                          >
                            {/* User Avatar */}
                            {
                              shouldShowHeader 
                              ? <div className={`relative z-95
                                ${!message.isReply ? "place-self-start pt-1" : "pt-5" } `}>
                                  {!message.userAvatar
                                    ? <BsDiscord className="w-10 h-10 p-1 bg-indigo-500 rounded-full z-10"/>
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
                              : 
                              <div className='opacity-0 group-hover:opacity-100 m-1 pr-1 text-xs text-gray-400'>
                                {formatTimeStamp(message.dateTimestamp || "")}
                              </div>
                            }

                            <div>
                              {/* Reply Message */}
                              {
                                (message.isReply) && (
                                <div className='text-sm flex items-center relative'>
                                    {/* "L-shape" connector */}
                                    <div className="bg-transparent h-10 w-8 hover:border-zinc-500
                                      absolute -left-8 top-2 rounded-tl-lg border-t-2 border-l-2 cursor-pointer"
                                      ref={replyMessageRef}
                                      onClick={handleReplyThreadClick}
                                      >
                                    </div>

                                    {/* Reply Message User Avatar */}
                                    <div className='flex items-center'>
                                      {
                                        message.repliedTo 
                                        ? (<div>
                                            {
                                              message.userAvatar 
                                              ? <img 
                                                  src={message.userAvatar}
                                                  alt={message.displayName} 
                                                />
                                              : <BsDiscord 
                                                  className="w-4 h-4 rounded-full 
                                                  bg-indigo-500 p-0.5 mx-1"
                                                />
                                            }
                                          </div>)
                                        : (
                                          <div>
                                            <TiArrowBack className='bg-black rounded-full w-4 h-4 p-0.5 mx-1'/>
                                          </div>
                                        )
                                      }
                                      
                                      {/* User Display name and message */}
                                      <div className="cursor-pointer flex items-center">
                                        <p className="font-semibold inline-block hover:underline cursor-pointer">
                                          {message.repliedTo?.displayName}&nbsp;
                                        </p>

                                        {/* Reply Message Content */}
                                        <div>
                                          {message.repliedTo 
                                            ? <p>{message.repliedTo.message}</p>
                                            : <p className='text-gray-400 italic'>Original Message was deleted</p>
                                          }
                                        </div>
                                      
                                        {
                                          message.repliedTo?.isContentWithImg && (
                                            <div>
                                              <p className='inline-block mr-2 font-bold italic'>Click to see Image</p>
                                              <FaRegImage className="inline-block mx-1"/>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </div>
                                </div>
                                )
                              }

                              {/* Display name and date time stamp */}
                              {
                                shouldShowHeader && (
                                  <p className='text-white'>
                                    <span className="font-semibold hover:underline cursor-pointer">
                                      {message.displayName}
                                    </span>&nbsp;

                                    <span className="font-medium text-xs text-gray-400">
                                      {formatDateTimestamp(message.dateTimestamp || "")}
                                    </span>
                                  </p>
                                )
                              }

                              {/* Message Content */}
                              {/* add condition isServerInvite */}
                              <div className={`${message.isContentWithImg && "py-1"}`}>

                                {
                                  messageToMutate?.messageId === message.messageId &&
                                    messageToMutate?.allowEdit 
                                  ? <form action="" 
                                      onSubmit={handleUpdateMessage}
                                      className='h-15 flex flex-col w-full'>
                                      <input 
                                        type="text" 
                                        ref={editMessageInputRef}
                                        defaultValue={messageToMutate.message}
                                        className="bg-[#1115] pl-2 border border-[#363c41] h-full
                                        focus:outline-0 rounded-md"
                                      />
                                      <p className='text-xs mb-1'>
                                        Escape to&nbsp;
                                        <span 
                                          onClick={() => setMessageToMutate(undefined)}
                                          className='text-blue-500 hover:underline cursor-pointer'>cancel</span>. Enter to&nbsp; 
                                        <span className='text-blue-500 hover:underline cursor-pointer'>save</span>
                                      </p>
                                    </form>
                                  : <h1 className={`w-full
                                      ${message.isServerInvite 
                                        ? "text-blue-500 hover:underline cursor-pointer" 
                                        : ""
                                      }
                                    `}>
                                    <p>
                                      {message.message} <span className='text-xs text-gray-600'>{message.isEdited && "(edited)"}</span>
                                    </p>
                                  </h1>
                                }
                                {/* Need to add isLoadingMetaData here*/}
                                {isLoadingMetaData && (
                                  <div className='bg-[#111111] w-100 border border-[#363c41] p-2 rounded-md mb-1 animate-pulse'></div>
                                )}

                                {
                                  message.isServerInvite && !isLoadingMetaData && (
                                    <div className='bg-[#111111] w-100 border border-[#363c41] p-2 rounded-md mb-1'>
                                      <p>You're Invited to join {fetchedMetaData?.serverName}</p>

                                      <div className='flex'>
                                        <div className='h-15 w-15 bg-gray-700 rounded-md 
                                          flex items-center justify-center font-bold'>
                                          {getInitials(fetchedMetaData?.serverName || "")}
                                        </div>

                                        <div className='p-2'>
                                          <p>{fetchedMetaData?.serverName}</p>
                                          <p>0 online . {fetchedMetaData?.serverMemberCount} Members</p>
                                        </div>

                                        <button 
                                          onClick={() => handleJoinServer(
                                            fetchedMetaData?.serverInviteCode || "", 
                                            fetchedMetaData?.channelId || "",
                                            currentUser,
                                          )}
                                          className='bg-green-500 p-2 rounded-lg w-25 h-8'>
                                            Join
                                        </button>
                                      </div>
                                    </div>
                                  )
                                }
                              </div>
                              {/* UI Animation loader for new messages with images */}
                              {
                                ((isPending && mutatedVariable?.messageId === message.messageId) || 
                                (!message.messageImgUrl && message.isContentWithImg)) &&
                                <div className="w-105 h-70 bg-gray-800 animate-pulse rounded-xl relative ">

                                  {/* Spinner */}
                                  <div className="w-8 h-8 border-4 border-blue-500 absolute top-1/2 left-1/2
                                    transform -translate-1/2 -translate-y-1/2 border-t-transparent 
                                    rounded-full animate-spin">
                                  </div>

                                </div>
                              }

                              {
                                isUpdateMessagePending && 
                                mutatedMessageVariable.messageId === message.messageId && 
                                <div className='h-10 rounded-md bg-gray-800 animate-pulse w-40'></div>
                              }

                              {
                                (message.isContentWithImg && message.messageImgUrl) &&
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
                              text-xl flex items-center gap-3 p-2 opacity-0 
                              group-hover:opacity-100 rounded-md shadow-2xl">
                              
                              {/* Reply Icon */}
                              <BsArrow90DegLeft 
                                data-tooltip-id="message-reply"
                                data-tooltip-content="Reply"
                                className="cursor-pointer p-0.5 
                                hover:bg-[#35373C] hover:text-[#DBDEE1]"
                                onClick={() => setReplyMessageObject({
                                  messageId: message.messageId || "",
                                  message: message.message,
                                  userId: message.userId,
                                  displayName: message.displayName,
                                  imgUrl: message.messageImgUrl,
                                  isContentWithImg: message.isContentWithImg
                                })}
                              />

                              {/* Forward Icon */}
                              <BsArrow90DegRight 
                                data-tooltip-id="message-forward"
                                data-tooltip-content="Forward"
                                className="cursor-pointer p-0.5 
                                hover:bg-[#35373C] hover:text-[#DBDEE1]"
                              />

                              {/* more options (copy text, add reaction, etc..) */}
                              <FaEllipsisH 
                                data-tooltip-id="message-more"
                                data-tooltip-content="More"
                                className="cursor-pointer p-0.5 
                                hover:bg-[#35373C] hover:text-[#DBDEE1]"
                                onClick={(e) => handleMessageOptionsPanel(
                                  e, 
                                  message
                                )}
                              />
                            </div>

                            <Tooltip id="message-reply" place="top" className="z-50"/>
                            <Tooltip id="message-forward" place="top" className="z-50"/>
                            <Tooltip id="message-more" place="left" className="z-50"/>
                            
                        </div>
                    </div>
                  )
                })
              }
            </div>
            )
          }
          {/* When opening channel, for now, it will always show the latest message of the channel
            not the default one where the user left of */}
          <div ref={latestMessage} />
        </div>
      </div>
      
      {/* Message Input */}
      <div className='p-4 flex-none relative z-0'>
        {/* Reply Message Feature */}
        {
          replyMessageObject.messageId && (
            <div className='bg-[#383a40] rounded-t-lg px-3 py-1 border-b-2 
                border-[#444c53] flex items-center justify-between'>
              <p>Replying to&nbsp;
                <span className="text-gray-100 font-semibold">
                  {replyMessageObject.displayName}
                </span>
              </p>
              <IoMdCloseCircleOutline 
                  className=" cursor-pointer text-xl"
                  onClick={() => setReplyMessageObject({
                      messageId: "",
                      message: "",
                      userId: "",
                      displayName: "",
                      isContentWithImg: false
                    })
                  }
                />
            </div>
          )
        }

        <div className={`bg-[#383a40] p-2 flex flex-col items-start 
          ${replyMessageObject.messageId ? "rounded-b-lg" : "rounded-lg"} 
            justify-center relative`}>
          
          {/* Image/ File list container */}
          <div className='flex gap-5 items-center'>
            {
              imgList?.length > 0 && (
                imgList?.map((img, i) => (
                  <div key={i} className={`h-50 w-45 bg-[#202122] rounded-lg 
                  relative flex flex-col items-center`}>
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
          
          {/* Message/Chat Input */}
          <div className="flex items-center relative w-full">
            <form action="" onSubmit={sendMessage} className="w-full">
              <input 
                type="text" 
                ref={messageInputRef}
                placeholder={`Message ${serverId ? "#" : "@"}${conversationDetails?.conversationName}`}
                className="bg-transparent w-full pl-9 py-3 focus:outline-0"
                onPaste={handlePasteText}
              />
            </form>

            <FiPlus className="absolute top-2.5 text-3xl p-1 
              hover:bg-white/20 rounded-lg cursor-pointer duration-400"
              onClick={() => setFileAttachmentPanel(!fileAttachementPanel)}
            />
          </div>
          <Tooltip id="delete-message-file" place="top"/>
        </div>

        {
          fileAttachementPanel && (
            <div className="absolute bottom-15 left-8 bg-[#181d22] 
              shadow-xl p-3 border-[#363c41] border rounded-lg z-999">

              <button 
                type="button"
                onClick={handleInputFileRefClick}
                className="hover:bg-white/10 p-1 px-2 rounded-lg cursor-pointer">
                <RiFileUploadLine className="inline-flex mb-1 mr-2 "/>
                Upload a File
              </button>
            </div>
          )
        }
        <input 
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            handleImageInput(e)
          }}
          accept="image/*"
          className="hidden" 
        />
      </div>
      
      {/* Message/Chat Options */}
      { messageOptionsPanel && (
        <div className='absolute bg-[#111113] z-99 p-2 m-3 rounded-md shadow-xl
        flex flex-col items-start gap-2 overflow-auto'
        style={{
          // if the message to be updated is at the bottom of the messages container
          // make sure to set message options to not go beyond the window height to prevent white screen
          top: panelCoords.y + 160 > window.innerHeight ? panelCoords.y - 110 : panelCoords.y - 70,
          left: panelCoords.x - 180
        }}
        >
          {currentUser.userId === messageToMutate?.userId && (
            <div className='flex flex-col gap-2 items-start'>

              <button 
                type='button'
                className='cursor-pointer hover:bg-white/10 p-2 rounded-md'
                onClick={() => {
                  setMessageOptionsPanel(false)
                  setMessageToMutate(msg => {
                    if (!msg) return msg;

                    return {
                      ...msg,
                      allowEdit: true
                    }
                  })
                }}
              >
                Update Message
              </button>

              <button 
                type='button'
                className='cursor-pointer p-2 rounded-md hover:bg-red-900 text-red-400'
                onClick={() => {
                  setMessageOptionsPanel(false)
                  setMessageToMutate(msg => {
                    if (!msg) return msg;

                    return {
                      ...msg,
                      allowDelete: true
                    }
                  })
                }}
                >
                Delete Message
              </button>
            </div>
          )}
          <button className='cursor-pointer hover:bg-white/10 p-2 rounded-md'>Copy Text</button>
          <button className='cursor-pointer hover:bg-white/10 p-2 rounded-md'>Report Message</button>
        </div>
      )}

      {/* Delete Message Modal */}
      {
        messageToMutate?.allowDelete && messageToMutate && (
          <div className='fixed inset-0 bg-black/80 h-full w-full 
            shadow-2xl z-99 flex items-center justify-center'>

            <div className=' w-120 bg-[#232428] rounded-md text-2xl p-3'>

              {/* Modal Header */}
              <div className='flex items-center justify-between'>
                <div>
                  <p>Delete Message</p>
                  <p className='text-sm text-gray-400'>
                    Are you sure you want to delete this message?
                  </p>
                </div>
                <CgClose 
                  onClick={() => setMessageToMutate(undefined)}
                />
              </div>

              {/* Modal Content */}
              <div className='bg-[#111113] m-2 p-3 rounded-md shadow-2xl'>

                <div className='flex items-center gap-3'>
                  {
                    messageToMutate.userAvatar 
                    ? <img 
                        src={messageToMutate.userAvatar}
                        alt={messageToMutate.displayName}
                        className='h-12 w-12 rounded-full bg-gray-500'
                      />
                    : <BsDiscord className='h-10 w-10 rounded-full p-1 bg-indigo-500'/>
                  }

                  <div className=''>
                    <p className='text-lg'>{messageToMutate.displayName}&nbsp; 
                      <span className='text-xs text-gray-400'>
                        {formatDateTimestamp(messageToMutate.dateTimestamp || "")}
                      </span>
                    </p>
                    <p className='text-lg'>{messageToMutate.message}</p>
                  </div>

                </div>
              </div>

              <p className='text-sm py-4'>
                There is no pro tip. Dont wanna do that shit. Just bare with this Modal to delete messages lmao
              </p>
              
              {/* Modal Footer */}
              <div className='flex items-center gap-2 mx-2 text-lg'>
                <button
                  type='button'
                  onClick={() => setMessageToMutate(undefined)}
                  className='p-1 bg-gray-600 hover:bg-gray-500 duration-100 flex-1 
                  rounded-md cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={() => handleDeleteMessage()}
                  className='p-1 bg-red-500 hover:bg-red-400 duration-100 flex-1 
                  rounded-md cursor-pointer'
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        )
      }
      
    </div>
  )
}

export default MessagesComponent