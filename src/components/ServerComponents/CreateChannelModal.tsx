
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from '../../context/UserContext';
import { createChannel } from '../../services/serverService';
import type { 
  Channel, 
  CreateChannelPayload 
} from '../../types/ServerTypes';
import { 
  useMutation, 
  useQueryClient 
} from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { CgClose } from 'react-icons/cg'
import { PiSpeakerSimpleHighLight } from "react-icons/pi";
import { MdOutlineForum } from "react-icons/md";
import { RiHashtag, RiLockFill, RiShieldUserFill } from "react-icons/ri";
import type { IconType } from 'react-icons';



interface CreateChannelModalProps{
  closeModal: () => void;
  sectionName: string;
  selectedCategoryId: string;
}

const CreateChannelModal = (
  {
    closeModal,
    sectionName,
    selectedCategoryId
  }: CreateChannelModalProps) => {
  
  const queryClient = useQueryClient();
  const { user } = useCurrentUser() 
  const { serverId } = useParams()
  
  // radio button values will be stored here on select
  const [textChannelOption, setTextChannelOption] = useState<string>("text")
  const [createChannelStep, setCreateChannelStep] = useState<number>(1)

  // dynamic display of text for sub headers and input value
  const [channelName, setChannelName] = useState<string>("")

  // refers to the roles that have access in the private channels
  // when creating new channel
  const [roleAccess, setRoleAccess] = useState<string>("")
  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  
  // contains existing roles and members of the server.
  // will be retrieved from the backend
  //const [serverRoles, setServerRoles] = useState([])
  const [serverMembers, setServerMembers] = useState([])

  const { 
    mutateAsync: createChannelMutation,
    isPending,
  } = useMutation({
    mutationKey: ["createChannel"],
    mutationFn: async (payload: CreateChannelPayload) => await createChannel(payload),
    
    onMutate: async(createdChannel) => {
      await queryClient.cancelQueries({queryKey: ["serverChannels", serverId]})

      const channels = queryClient.getQueryData(["serverChannels", serverId])

      if (!channels){
        return;
      }

      queryClient.setQueryData(["serverChannels", serverId], (channel: Channel) => [
        channel,
        {
          channelName: createdChannel.channelName,
          categoryId: createdChannel.categoryId,
          icon: createdChannel.icon
        }
      ])

      return { channels }
    },
    
    onError: (context)=> {
      queryClient.setQueryData(["createChannel", serverId], context.message)
    },

    onSuccess: (response) => {
      console.log(response)
      queryClient.invalidateQueries({queryKey: ["serverChannels"]})
      closeModal();
    }
  })


  const handleCreateChannel = async() => {
    console.log("Creating Channel...")
    setServerMembers([])

    if (!selectedCategoryId) return;

    const payload: CreateChannelPayload = {
      categoryId: selectedCategoryId,
      channelName: channelName,
      icon: textChannelOption,
      channelType: textChannelOption
    }

    createChannelMutation(payload)
  }

  const LockedChannelIcon = (value: string, option: string) => {  
    let SelectedIcon: IconType = RiHashtag;
    
    if (option === "text"){
      SelectedIcon = RiHashtag
    }
    else if (option === "voice"){
      SelectedIcon = PiSpeakerSimpleHighLight
    }
    else {
      SelectedIcon = MdOutlineForum
    }
    return (
      <div className="relative items-center justify-center 
        inline-block pt-1.5 mr-0.5 w-5 h-5">
        {/* Main Icon */}
        {
          value === "text"
          ? <SelectedIcon />
          : <MdOutlineForum className=""/>
        }
        
        
        {/* Lock in corner of main icon to indicate isPrivate */}
        <div className="absolute top-0.75 right-0.5">
          <RiLockFill className="text-[9px]" />
        </div>
      </div>
    );
  };

  const formatChannelName = (name: string) => {
    const format =  name.toLowerCase().replace(/\s+/g, '-')
    setChannelName(format)
  }


  const firstPage = () => {
    return (
      <div className="p-4">
        {/* Modal Header */}
        <div className='text-left'>
          <div className="my-5">
            <p className="text-2xl font-bold">Create a channel</p>
            <p className='text-gray-400'>in {sectionName}</p>
          </div>
        </div>

        {/* Radio Buttons */}
        <div>
          <p className='pb-2 font-semibold'>Channel Type</p>
          <div className='flex items-center mb-3 cursor-pointer'
            onClick={() => setTextChannelOption("text")}
            >
            <input 
              type="radio" 
              name="fav_language" 
              checked={textChannelOption === "text"}
              onChange={() => {}}
              className='bg-[#232428] mr-2 peer h-5 w-5 appearance-none 
                rounded-full border border-slate-300 cursor-pointer duration-200
                checked:border-[#7289DA] checked:border-6 checked:bg-white'
            />

            <div className='text-start'>
              <div className='text-lg font-bold '>
                {
                  isPrivate 
                  ? LockedChannelIcon("text", "text")
                  : <RiHashtag className='inline-block mr-1'/> 
                }
                Text
              </div>
              <p className='text-gray-400 text-sm'>
                Send messages, images, GIFs, emojis, opinions, and puns
              </p>
            </div>
          </div>

          <div className='flex items-center mb-3 cursor-pointer'
            onClick={() => setTextChannelOption("voice")}
            >
            <input 
              type="radio" 
              name="fav_language" 
              checked={textChannelOption === "voice"}
              onChange={() => {}}
              className='bg-[#232428] mr-2 peer h-5 w-5 appearance-none 
                rounded-full border border-slate-300 cursor-pointer duration-200
                checked:border-[#7289DA] checked:border-6 checked:bg-white'
            />

            <div className='text-start'>
              <div className='text-lg font-bold '>
                {
                  isPrivate 
                  ? LockedChannelIcon("text", "voice")
                  : <PiSpeakerSimpleHighLight 
                      className='inline-block mr-1'
                      /> 
                }
                Voice
              </div>
              <p className='text-gray-400 text-sm'>
                Hang out together with voice, video and screen share
              </p>
            </div>
          </div>
          
          <div className='flex items-center mb-3 cursor-pointer'
            onClick={() => setTextChannelOption("forum")}
            >
            <input 
              type="radio" 
              name="fav_language" 
              checked={textChannelOption === "forum"}
              onChange={() => {}}
              className='bg-[#232428] mr-2 peer h-5 w-5 appearance-none 
                rounded-full border border-slate-300 cursor-pointer duration-200
                checked:border-[#7289DA] checked:border-6 checked:bg-white'
            />

            <div className='text-start '>
              <div className='text-lg font-bold'>
                {
                  isPrivate 
                  ? LockedChannelIcon("text", "forum")
                  : <MdOutlineForum 
                      className='inline-block mr-1'
                    /> 
                }
                Forum
              </div>
              <p className='text-gray-400 text-sm'>
                Create a space for organised discussions
              </p>
            </div>
          </div>
        </div>

        {/* Channel Name Input and isPrivate Channel option */}
        <div className='mt-5'>
          <p>Channel Name</p>

          <div className='relative flex items-center mt-2 mb-5'>
            <div className='absolute left-2
              pointer-events-none text-[#80848E]'>
              {
                textChannelOption === "text" || 
                textChannelOption === "voice"

                ? isPrivate 
                  ? LockedChannelIcon("text", "text")
                  : <RiHashtag />
                : <MdOutlineForum />
              }
            </div>

            <input 
              type='text'
              placeholder={`new-channel`}
              value={channelName}
              onChange={(e) => formatChannelName(e.target.value)}
              className='bg-[#111113] outline-[#7289DA] focus:outline-2 
              text-gray-400 pl-7 p-2 rounded-md cursor-pointer w-full'
            />
          </div>
            
          <div className='flex items-center justify-between'>
            <div className=''>
              <RiLockFill className='inline-block text-xl pb-1'/> Private Channel
              <p className='text-gray-400 text-sm'>
                Only Selected members and roles will be able to view this channel
              </p>
            </div>
            
            
            {/* Toggle Element */}
            <div 
              className={`relative w-14 h-6.5 rounded-xl 
                cursor-pointer border border-[#363c41] 
                ${isPrivate ? "bg-[#7289DA]" : "bg-[#232428]"}
                `}
              onClick={() => setIsPrivate(!isPrivate)}
              >
              <span 
                className={`absolute top-1 h-4 w-4 rounded-full bg-white
                  duration-400 transition-all ease-in-out 
                  ${isPrivate 
                    ? "translate-x-8.25 " 
                    : "translate-x-0.75"
                  }`}>
              </span>
            </div>

          </div>
          
          {/* Modal Footer btn row */}
          <div className="flex justify-between items-center gap-2 mt-4">
            <button
              type="button"
              className="w-full bg-[#232428] p-2 rounded-md my-2 
              cursor-pointer hover:bg-white/10 durattion-200"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button type="button" 
              disabled={channelName.length < 1 || isPending}
              className="w-full font-semibold cursor-pointer duration-100
                bg-[#607de4] hover:bg-[#7289DA] p-2 rounded-md 
                disabled:opacity-60 disabled:pointer-events-none"
              onClick={() => (
                isPrivate 
                  ? setCreateChannelStep(createChannelStep + 1)
                  : handleCreateChannel()
              )}  
              >
              {
                isPrivate ? "Next" : "Create Channel" 
              }
            </button>
          </div>
        </div>
      </div>
    )
  }

  const secondPage = () => {
    return (
      <div className=''>
        {/* Modal Header */}
        <div className='text-left p-4'>
          <div className="my-3">
            <p className="text-2xl font-bold">Add members or roles</p>
            <p className='text-gray-400'>
              {
                textChannelOption === "text" ||
                textChannelOption === "voice"
                ? LockedChannelIcon("text", "text")
                : LockedChannelIcon("forum", "forum")

              }
              {channelName}
            </p>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className=' px-4 flex-1 overflow-y-auto pb-2 h-140'>
          <input 
            placeholder={`e.g Moderators, @wumpus`}
            value={roleAccess}
            onChange={(e) => setRoleAccess(e.target.value)}
            className='bg-[#111113] outline-[#7289DA] focus:outline-2 
            text-gray-400 pl-2 p-2 rounded-md cursor-pointer w-full'
          />
          <p className='mt-2 text-sm'>
            Add individual members by starting with @ or type a role name
          </p>

          <div className='mt-7'>
            <p className='font-bold'>Roles</p>

            <div className={`p-2.5 rounded-md hover:bg-white/10
              ${serverMembers.length > 1 ? "" : "opacity-50"}`}>
              <input 
                type="checkbox" 
                checked={serverMembers.length < 1 ? true : false}
                onChange={() => {}}
                className='bg-[#232428] mr-3 peer h-5 w-5 appearance-none 
                  rounded-sm border border-slate-300 cursor-pointer duration-200
                  checked:bg-[#7289DA]  align-middle'
              />

              {/* Should only show if there are no created roles in the server */}
              <p className='inline-block align-middle'>
                <RiShieldUserFill className='inline-block mr-1'/>
                {
                  serverMembers.length > 1
                  ? ""
                  : "You haven't created any roles yet"
                }
              </p>
            </div>

          </div>

          <div className='mt-5 '>
            <p className='font-bold mb-2'>Members</p>
            
            <div className='p-2.5 rounded-md hover:bg-white/10 
              flex items-center '>
              <input 
                type="checkbox" 
                onChange={() => {}}
                className='bg-[#232428] mr-2 peer h-5 w-5 appearance-none 
                  rounded-sm border border-slate-300 cursor-pointer duration-200
                  checked:bg-[#7289DA] align-middle'
              />
              
              {/* Map server members here... */}
              <div className='flex items-center p-1'>
                <div className='mr-2'>
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" 
                    alt={user?.userName}
                    className='h-6 w-6 rounded-full bg-gray-100 ' 
                  />
                </div>
                {
                  serverMembers.length > 1
                  ? "Members here..."
                  : (
                    <div>
                      {user?.Firstname} 
                      <span className='font-thin text-gray-400 ml-2'>
                        {user?.userName}
                      </span>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>

        {/* Modal Page Footer */}
        <div className='mb-auto border-t border-[#363c41] px-3 pb-5'>
          <div className="flex justify-between items-center gap-2 mt-4">
            <button
              type="button"
              className="w-full bg-[#232428] p-2 rounded-md my-2 
              cursor-pointer hover:bg-white/10 durattion-200"
              onClick={() => 
                setCreateChannelStep(createChannelStep - 1)
              }
            >
              Back
            </button>

            <button type="button" 
              disabled={channelName.length < 1 || isPending}
              className="w-full font-semibold cursor-pointer duration-100
                bg-[#607de4] hover:bg-[#7289DA] p-2 rounded-md 
                disabled:opacity-60 disabled:pointer-events-none"
              onClick={() => handleCreateChannel()}  
              >
              Skip
            </button>
          </div>
        </div>

      </div>
    )
  }


  return (
    <div>
      <motion.div className="flex flex-col w-120 bg-[#2B2D31] 
      text-white rounded-lg relative cursor-default duration-100"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}  
      >
        <CgClose 
          onClick={closeModal} 
          className="text-2xl absolute right-3 top-4 cursor-pointer"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={createChannelStep} // Mahalaga 'to para malaman ni Framer na nagbago ang content
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {createChannelStep === 1 && firstPage()}
            {createChannelStep === 2 && secondPage()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default CreateChannelModal