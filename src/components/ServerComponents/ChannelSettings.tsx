import { useState, type SetStateAction } from "react";

import { IoIosCloseCircleOutline } from "react-icons/io";
import {  RiDeleteBinLine  } from "react-icons/ri";
import { CgClose } from "react-icons/cg"

import ChannelOverview from "../ChannelSettingsComponents/ChannelOverview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChannel } from "../../services/serverService";
import { useParams } from "react-router-dom";
import type { Category, Server } from "../../types/ServerTypes";

interface ChannelSettingsProps{
  closeModal: () => void;
  onChannelDelete: () => void;
  channelId: string;
  channelName: string;
  categoryName: string;
}


const channelSettings = [
    {
      id: 101,
      name: "Overview"
    },
    {
      id: 102,
      name: "Permissions"
    },
    {
      id: 103,
      name: "Invites"
    },
    {
      id: 104,
      name: "Integrations"
    },
    {
      id: 105,
      name: "Delete Channel"
    }
]


const Fallback = () => {
  return (
    <div></div>
  )
}

const CHANNEL_TAB_COMPONENT: Record<string, React.ComponentType<{ 
  channelId: string, 
  setChannelNameState: React.Dispatch<SetStateAction<string>>}
  >> = {
  overview: ChannelOverview,

}

const ChannelSettings = ({
  closeModal,  
  onChannelDelete,
  channelId,
  channelName, 
  categoryName,
}: ChannelSettingsProps) => {

  const queryClient = useQueryClient();
  const { serverId } = useParams();

  const [channelNameState, setChannelNameState] = useState<string>(channelName)
  const [activeTab, setActiveTab] = useState<number>(101)
  const [component, setComponent] = useState<string>("overview");
  const [deleteChannelModal, setDeleteChannelModal] = useState<boolean>(false)

  const SelectedComponent = CHANNEL_TAB_COMPONENT[component]

  const {
    mutate: deleteChannelMutate
  } = useMutation({
    mutationKey: ["deleteChannel"],
    mutationFn: async (channelId: string) =>  await deleteChannel(channelId),

    onMutate: async () => {
      
      await queryClient.cancelQueries({ queryKey: ["serverChannels", serverId]})

      const channels = queryClient.getQueryData<Server>(["serverChannels", serverId])

      if (!channels) return;

      console.log(channels)

      queryClient.setQueryData(["serverChannels", serverId], (oldChannels: Server) => {
        if (!oldChannels) return oldChannels;

        const categories = oldChannels?.serverCategories?.map((cat: Category) => ({
          ...cat,
          categoryChannels: cat.categoryChannels?.filter((ch) => ch.channelId !== channelId)
        }))

        console.log("new channels: ", categories)

        return { ...oldChannels, serverCategories: categories }
      })

      return { channels }
    },

    onError: (error, _variables, context) => {
      console.error("Error: ", error)
      queryClient.setQueryData(["serverChannels", channelId], context?.channels)
    },

    onSuccess: (response) => {
      console.log(response)

      queryClient.invalidateQueries({queryKey: ["serverChannels", channelId]})
      setDeleteChannelModal(false)
      onChannelDelete();
      closeModal()
    }


  })

  const handleDeleteChannel = () => {

    if (!channelId || !serverId){
      console.log("Channel ID or Server ID not found")
      return;
    }

    console.log("Deleting Channel....")

    deleteChannelMutate(channelId)
  }


  return (
    <div className="h-screen w-screen overflow-hidden bg-[#23272a]
      grid grid-cols-24 font-thin">
      
      <div className="absolute right-1/6 top-10 text-[#c6ccd3] cursor-pointer flex flex-col items-center">
        <IoIosCloseCircleOutline onClick={closeModal} className="text-5xl "/>
        <p>ESC</p>
      </div>

      <div className="col-span-9 bg-[#111113] pr-5 text-[#c6ccd3]">
        <div className="self-center justify-self-end w-60 mt-15 h-full overflow-auto font-semibold">
          
          <div className="pointer-events-none flex items-center gap-2 uppercase text-xs 
          font-bold overflow-x-hidden whitespace-nowrap">
            <p className="text-gray-600"># {channelNameState}</p>
            <p className="">{categoryName}</p>
          </div>
          
          {
            channelSettings.map((channel) => (
              <div
                key={channel.id}
                className={` my-2 rounded-md p-1 cursor-pointer duration-100
                  ${channel.id === 105 
                    ? " text-red-400 hover:bg-red-950" 
                    : "hover:bg-white/10" 
                  }
                  ${activeTab === channel.id ? "bg-white/10 text-gray-300" : "text-gray-400"}
                `}
                onClick={() => {
                  

                  // if the tab is not a delete tab, then switch component
                  if (channel.id !== 105){
                    setActiveTab(channel.id)
                    setComponent(channel.name.toLowerCase())
                  }
                  
                }}
              >
                
                <div 
                  className={`flex items-center justify-between ${channel.id === 105 &&  "my-1"}`}
                  onClick={() => {
                    if (channel.id === 105){
                      setDeleteChannelModal(true)
                    } 
                  }}
                  >
                  {channel.name}
                  {channel.id === 105 && <RiDeleteBinLine />} 
                </div>
    
              </div>
            ))
          }
        </div>
      </div>

      <div className="mt-15 mx-8 text-white w-full col-span-9">
        {
          SelectedComponent 
          ? <SelectedComponent channelId={channelId} setChannelNameState={setChannelNameState}/>
          : <Fallback />
        }
      </div>

      {
        deleteChannelModal && (
          <div className="fixed inset-0 h-screen w-full bg-black/60 z-99
            flex items-center justify-center
          ">
            <div className="h-50 w-100 p-5 flex flex-col text-xl font-semibold text-white 
            bg-[#2B2D31] rounded-lg">

              <div className="flex items-center justify-between">
                <p>Delete Channel</p>
                <CgClose 
                  className="cursor-pointer"
                  onClick={() => setDeleteChannelModal(false)}
                />
              </div>

              <div className="text-gray-400 w-full font-normal text-base my-6">
                Are you sure you want to delete&nbsp;
                <p className="font-extrabold inline-block text-gray-300">
                   #{channelName}?&nbsp;
                </p>
                This cannot be undone
              </div>

              <div className="w-full flex gap-2  text-[16px]">
                <button
                  type="button"
                  className="bg-[#232428] hover:bg-white/10 w-full p-2 
                  cursor-pointer rounded-md duration-100"
                  onClick={() => setDeleteChannelModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-400 w-full p-2 
                  rounded-md cursor-pointer duration-100"
                  onClick={handleDeleteChannel}
                >
                  Delete Channel
                </button>
              </div>
              
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ChannelSettings