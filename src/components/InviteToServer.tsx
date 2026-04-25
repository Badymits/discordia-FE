import { useState, useMemo } from "react";
import { motion,AnimatePresence } from "framer-motion";

import { CgClose } from "react-icons/cg";
import type { IconType } from 'react-icons';
import { HiHashtag, HiLockClosed } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { PiWarningCircleFill } from "react-icons/pi";

import { 
  serverMembers, 
  serverTwoMembers 
} from "../utils/DummyData";
import type { Channel, ServerMembers } from "../types/ServerTypes";



interface InviteToServerProps{
  closeModal: () => void;
  channelObj: Channel;
  channelIcon?: IconType
  serverName: string;
}

const InviteToServer = ({
  closeModal,
  channelObj,
  serverName
}: InviteToServerProps ) => {

  const combinedMembers: ServerMembers[] = useMemo(() => [
    ...serverMembers, 
    ...serverTwoMembers,
    {
      id: 33,
      user: "that333",
      userTag: "Im3",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=15",
    },
    {
      id: 67,
      user: "sixorSEVEEEEEN",
      userTag: "67676767",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=67",
    },
    {
      id: 29,
      user: "oldSchool baby",
      userTag: "you_know_what",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=27",
    },
    {
      id: 49,
      user: "Terry Crews",
      userTag: "D_Latrell",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=47",
    },
  ], [])

  const [searchInput, setSearchInput] = useState<string>("")
  //const [debouncedSearch, setDebouncedSearch] = useState(searchInput)

  const filteredMembers = useMemo(() => {
    return combinedMembers.filter((member) => 
      member.user.toLowerCase().includes(searchInput.toLowerCase()) || 
      member.userTag.toLowerCase().includes(searchInput.toLowerCase())
    )
  }, [searchInput, combinedMembers])

  const LockedChannelIcon = () => {
    return (
      <div className="relative flex items-center justify-center w-5 h-5">
        {/* Main Hashtag */}
        <HiHashtag className="text-[#80848E] text-xl" />
        
        {/* Lock icon */}
        <div className={`absolute -top-0.5 -right-0.5 
          p-[0.5px] bg-[#2B2D31] rounded-full`}>
          <HiLockClosed className="text-[#80848E] text-[10px]" />
        </div>
      </div>
    );
  };

  const inviteToServerContent = () => {
    return (
      <div className="">

        {/* Modal Header */}
        <div className='text-left p-5'>
          <div className="">
            <p className="text-2xl">Invite Friends to {serverName}</p>
            <p className='text-gray-400  flex items-center'>
              Recipients will land in&nbsp; 
              <span className="flex items-center font-thin">
                {channelObj.isPrivate ? <LockedChannelIcon />: <HiHashtag />} 
                {channelObj.channelName}
              </span>
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-5 py-2">
          {/* Search bar */}
          <div className='relative '>
            <input 
              value={searchInput || ""}
              placeholder={`Search for friends`}
              onChange={(e) => setSearchInput(e.target.value)}
              className='bg-[#111113] border border-[#363c41] 
              focus:outline-[#7289DA] focus:outline-2 text-[#ffffff] 
              p-2 pl-9  rounded-md cursor-pointer w-full' 
            />

            <FaSearch 
              className='absolute left-2 top-2.5 text-gray-500 text-lg '
            />
            {
              channelObj.isPrivate && (
                <p className="text-[11.5px] mt-1">
                  <PiWarningCircleFill 
                    className="inline-block mr-1 mb-px text-amber-400"
                  />
                  This channel is private, only select members and 
                  roles that can view this channel.
                </p>
            )}
            
          </div>

          {/* Users/Friends Map */}
          <div className="mt-5 overflow-y-auto h-120 scrollbar-thin 
            scrollbar-thumb-[#1e1f22] scrollbar-track-transparent 
            hover:scrollbar-thumb-[#a1a1a1]">
            {
              filteredMembers.length === 0 && (
                <p className=" text-center text-gray-400">NO RESULTS FOUND</p>
              )
            }
            {filteredMembers.map((member, i) => (
              <div
                key={i} 
                className="flex items-center justify-between 
                text-sm py-2.25 hover:bg-white/10 p-2 rounded-sm">
                  <div className="flex flex-1 items-center gap-2">
                    <img 
                      src={member.avatar} 
                      alt={member.user} 
                      className="h-8 w-8 rounded-full bg-gray-100"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold">{member.user}</p>
                      
                      <p className="text-xs text-gray-400">
                        {member.userTag}
                      </p>
                    </div>
                  </div>

                  <button 
                    className="bg-[#232428]  p-2 rounded-md 
                     cursor-pointer hover:bg-white/10 durattion-200"

                     >
                    Invite
                  </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Page Footer */}
        <div className=' border-t border-[#363c41]'>
          

          <div className="p-5">
            <p className="font-semibold">Or send a server invite link to a friend</p>

            <div className='relative'>
              <input 
                value={`https://discord.gg/YKGd4EJm`}
                className='bg-[#111113] border border-[#363c41] 
                focus:outline-[#7289DA] focus:outline-2 text-[#ebe8e8] 
                p-2  rounded-md cursor-pointer w-full my-1' 
                readOnly
              />

              {/* <FaSearch 
                className='absolute left-2 top-2.5 text-gray-500 text-lg '
              /> */}
              <button 
                type="button" 
                className=" 
                  absolute right-1.25 top-2.25 block
                  font-semibold cursor-pointer duration-100
                  bg-[#607de4] hover:bg-[#7289DA] w-20 py-1 rounded-md 
                  disabled:opacity-60 disabled:pointer-events-none"
                >
                Copy
              </button>
            </div>

            <p className="mt-5 text-xs text-gray-400">
              Your invite link expires in 7 days.&nbsp;
              <span 
                className="text-blue-400 hover:underline 
                decoration-blue-400 cursor-pointer">
                 Edit link
              </span>
            </p>
          </div>

          
        </div>
      </div>
    )
  }

  return (
    <div>
      <motion.div className="flex flex-col w-120 bg-[#2B2D31] 
      text-white shadow-2xl rounded-xl relative cursor-default duration-100"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}  
        >
        <CgClose 
          onClick={closeModal} 
          className="text-2xl absolute right-3 top-4 cursor-pointer"
        />
        <AnimatePresence mode="wait">
          <motion.div
              //key={createChannelStep} // Mahalaga 'to para malaman ni Framer na nagbago ang content
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
          >
              {/* {createChannelStep === 1 && firstPage()}
              {createChannelStep === 2 && secondPage()} */}
              {inviteToServerContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default InviteToServer