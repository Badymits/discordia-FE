
import { IoAdd, IoCloseCircleOutline } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import { useServerContext } from '../context/ServerContext';
import type {
  DirectChannel,
  ServerMembers
} from "../types/ServerTypes";
import { useState } from 'react';
import type { ServerUser } from '../types/User';
import { useQuery } from '@tanstack/react-query';
import {  fetchDirectChannels } from '../query/serverQueries';

import { BsDiscord } from 'react-icons/bs';
import { CgHello } from "react-icons/cg";
import { FaShop } from "react-icons/fa6";
import { SiTurbo } from "react-icons/si";


const MainPageMenu = [
  {
    name: "Friends",
    icon: <CgHello />
  },
  {
    name: "Nitro",
    icon: <SiTurbo />
  },
  {
    name: "Shop",
    icon: <FaShop />
  },
]

const DmAndChannelComp = () => {

  const {sampleUsers}  = useServerContext();
  const {directChannelId, serverId} = useParams();

  const [activeMainPageMenu, setActiveMainPageMenu] = useState<number | undefined>(
    directChannelId || serverId ? undefined : 0
  )

  const [currentUser] = useState<ServerUser>(() => {
  
    const userObj = JSON.parse(sessionStorage.getItem("UserObj") || "")

    if (userObj) return {
      userId: userObj.userId,
      displayName: userObj.displayname,
      username: userObj.username,
      imgUrl: userObj.imgUrl,
    }

    return {} as ServerUser
  })

  const { data: directChannels, isLoading } = useQuery({
    ...fetchDirectChannels(currentUser.userId || ""),
    enabled: !!currentUser.userId,
    staleTime: 1000 * 10 * 60,
    gcTime: 1000 * 10 * 60
  })

  console.log(directChannels)
  console.log(activeMainPageMenu)

  if (isLoading){
    return (
      <div className='shrink-0 w-70 bg-[#111113] border-x border-[#363c41] text-white '>
        {/* Search bar Loader */}
        <div>
          <div className='bg-[#2c2f33] p-2 m-3 animate-pulse rounded-md h-8 '></div>
          <hr className='border-[#363c41] '/>

          {/* Main Page Menu Loader */}
          <div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-6 bg-[#2c2f33] rounded-md animate-pulse mx-3 my-4 py-4 '></div>
            ))}
          </div>
          <hr className='border-[#363c41]  mx-2'/>
        </div>
        
        
        {/* Direct Messages List Loader */}
        <div className='m-2'>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-400'>Direct Messages</p>
            <IoAdd />
          </div>
          
          {[...Array(8)].map((_, i) => (
            <div key={i} className='flex items-center gap-2 my-6 animate-pulse'>
              {/* Avatar */}
              <div className='h-8 w-8 rounded-full bg-gray-600'></div>

              <div>
                <div className='h-4 w-30 rounded-md bg-[#2c2f33]'></div>
                <div className='h-4 w-15 bg-[#2c2f33] rounded-md mt-2'></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    )
  }


  return (
    <div className='bg-[#111113] shrink-0 w-70 text-white 
    border-x border-[#363c41] h-full '>

      {/* Search bar */}
      <div>
        <div className='bg-[#2c2f33] hover:bg-[#444649] p-2 m-2 
        rounded-md cursor-pointer truncate'> 
        Find or Start a conversation 
        </div>
        <hr className='border border-[#363c41] mb-1'></hr>
      </div>

      <div className='overflow-y-auto h-190 scrollbar-thin
      scrollbar-thumb-[#99AAB5] scrollbar-track-transparent px-1'>
        {/* Home Page Menu */}
        {(MainPageMenu || []).map((menu, i) => (
          <Link 
            to={menu.name === "friends" ? "/" : "/"}
            key={i}
            onClick={() => setActiveMainPageMenu(i)}
            >
            <div className={`flex items-center gap-3 ${activeMainPageMenu === i && "bg-white/10"}
            hover:bg-white/10 duration-100 rounded-md p-2 my-1`}>
              {menu.icon}
              <p>{menu.name}</p>
            </div>
          </Link>
        ))}

        <hr className='border-[#363c41]  mx-2 mt-2'/>
        <div className='flex items-center justify-between mx-3 py-2'>
          <p className='text-xs text-gray-400'>Direct Messages</p>
          <IoAdd />
        </div>
        {
          directChannels?.data?.map((dc: DirectChannel, i:number) => {

            // since its guaranteed that there 2 users, just filter excluding current user ID and
            // just get that user
            const recipient: ServerUser = 
                dc?.directChannelParticipants?.filter((user) => user.userId !== currentUser.userId)[0]

            return (
              <Link
                to={`/messages/${dc.directChannelId}`}
                key={i}
                className={`flex items-center justify-between p-2 mx-2 my-1  
                  rounded-md cursor-pointer hover:bg-[#444649] truncate
                  ${directChannelId === dc.directChannelId && "bg-white/20"}
                  `}
                onClick={() => setActiveMainPageMenu(undefined)}
                >
                <div className='flex items-center justify-center gap-2 '>
                    <div className='bg-gray-400 h-10 w-10 rounded-full relative'>
                      <div className='h-full'>
                        {
                          recipient.imgUrl ?
                          <img 
                            src={recipient.imgUrl}
                            alt={recipient.displayName}
                            className='h-full w-full rounded-full object-cover'
                            />
                          : <BsDiscord className='h-full w-full bg-indigo-500 rounded-full p-1'/>
                        }
                      </div>
                  </div>

                  <div className='truncate w-30'>
                    <p className='font-semibold'>{recipient.displayName}</p>
                    <p className='text-sm text-gray-400'>{recipient.username}</p>
                  </div>
                </div>
              </Link>
            )
            
          })
        }
        {sampleUsers.map((user:ServerMembers, i:number) => (
          <Link 
            to={`/messages/${user.userTag}`}
            key={i}
            className='flex items-center justify-between p-2 m-1  
            rounded-md cursor-pointer hover:bg-[#444649] truncate '
          >
            {/* User ICon and Status */}
            <div className='flex items-center justify-center gap-2'>
              <div className='bg-gray-400 h-10 w-10 
                rounded-full text-xs relative'>
                  <img 
                    src={user.avatar} 
                    alt={user.userTag}
                    className='h-full w-full rounded-full' 
                  />
                  <div className={`
                    ${user.status == "online" 
                      ? "bg-green-700" 
                      : user.status == "idle" 
                        ? "bg-yellow-500"
                        : user.status == "away"
                          ? "bg-red-700"
                      : "bg-gray-500"
                    } h-3 w-3 absolute 
                    right-0 bottom-0 rounded-full`}>
                  
                  </div>
              </div>

              <div className='truncate w-30'>
                <p>{user.displayName}</p>
                <p >{user.bio}</p>
              </div>

            </div>

            <div>
              <IoCloseCircleOutline className='text-gray-500 hover:text-gray-400 text-lg'/>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DmAndChannelComp