
import { Outlet } from 'react-router-dom'
import ServerList from './ServerList'
import { useCurrentUser } from '../context/UserContext';
import { useState } from 'react';
import { CiSettings } from 'react-icons/ci';
import { GiSoundWaves } from "react-icons/gi";
import { ImPhoneHangUp } from "react-icons/im";
import { BsDiscord } from 'react-icons/bs'

import { Tooltip } from 'react-tooltip';
import ProfileSettings from './ProfileSettings';
import AddServerModal from '../components/ServerComponents/AddServerModal';
import { useServerContext } from '../context/ServerContext';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../query/serverQueries';


const Layout = () => {

  //const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [openProfileSettings, setOpenProfileSettings] = useState(false) 
  const [openCreateServerModal, setOpenCreateServerModal] = useState<boolean>(false)

  const { 
    user,
    isInVoice,
    joinedVoiceChannel,
    setIsInVoice,
    setJoinedVoiceChannel
  } = useCurrentUser();

  const { servers } = useServerContext();

  const closeProfileSettings = () => {
    setOpenProfileSettings(false)
  }

  const handleAddServerModal = () => {
    setOpenCreateServerModal(!openCreateServerModal)
  }

  // const {data: userData} = useQuery({
  //   queryKey: ["user", user?.UserId],
  //   queryFn: () => getUser(user?.UserId || ""),
  //   enabled: !!user?.UserId
  // })

  const {
    data: userData,
    isLoading
  } = useQuery({
    ...fetchUser(user?.UserId || ""),
    enabled: !!user?.UserId
  })

  console.log(userData?.data)
  console.log(isLoading)

  return (
    <div className='flex w-full h-screen'>
      {/* SERVER LIST - Can be seen regardless of server page */}
      <ServerList 
        serverList={servers} 
        handleFunction={handleAddServerModal} 
      />

      {/* MAIN CONTENT (Home and ServerPage) */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* User Profile */}
      <div className={`bg-[#2c2f33] flex-1 text-white w-85
        absolute bottom-4 left-2 flex flex-col items-center justify-between gap-4 rounded-xl `}>
        
        {
          isInVoice && (
            <div className='w-full border-b border-[#363c41] px-4 py-2'>
              <div className='flex items-center justify-between'>

                <div>
                  <p className='text-green-300 font-semibold'>Voice Connected</p>
                  <div className='font-semibold text-[#949BA4] tracking-wide truncate w-50'>
                    {joinedVoiceChannel.serverName}/{joinedVoiceChannel.channelName}
                  </div>
                </div>
                
                <div className=''>
                  <GiSoundWaves 
                    className='inline-block mx-2  text-3xl cursor-pointer 
                    hover:bg-white/20 rounded-lg p-1'
                  />
                  <ImPhoneHangUp 
                    className='inline-block mx-1 text-3xl cursor-pointer
                    hover:bg-white/20 rounded-lg p-1'
                    onClick={() => {
                      setIsInVoice(false)
                      setJoinedVoiceChannel({
                        channelId: "",
                        channelName: "",
                        serverName: ""
                      })
                    }}
                  />
                </div>
              </div>
              
            </div>
          )
        }

        <div className={`flex items-center w-full px-4 py-2`}>
          <div className='flex items-center justify-start gap-2 w-full'>

            {/* User Avatar */}
            {
              userData?.data.imgUrl ? <img 
              src={userData?.data.imgUrl || ""} 
              alt={userData?.data.displayName} 
              className='h-10 w-12 rounded-full object-cover relative'
            />
            :
            <BsDiscord className='bg-indigo-500 h-10 w-12 rounded-full p-1'/>
            }
            
            

            <div 
              className='group hover:bg-white/10 p-1 
              rounded-md w-full cursor-pointer'
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {userData?.data.displayName}
              <div className='text-[#99AAB5] text-sm font-light duration-200'>
                {
                  isHovered 
                  ? `${userData?.data.displayName}`
                  : `${userData?.data.userName}`
                }
              </div>
            </div>
          </div>

          {/* Wala munang icons dito, settings muna */}
          <div>
            <div className='hover:bg-white/35 rounded-md'>
              <CiSettings 
                data-tooltip-id="settings"
                data-tooltip-content="User Settings"
                onClick={() => setOpenProfileSettings(!openProfileSettings)}
                className='text-3xl hover:text-3xl duration-800 
                cursor-pointer hover:rotate-180'/>
            </div>
          </div>
        </div>
        
        <Tooltip id="settings" place='top' className='z-50'/>
      </div>

      { openProfileSettings && (
          <div className='fixed inset-0 bg-black/80  z-999 
          flex items-center justify-center'>
            <ProfileSettings closeSettings={closeProfileSettings} />
          </div>
        )
      }

      {
        openCreateServerModal && (
          <div className='fixed inset-0 bg-black/80  z-50 
          flex items-center justify-center'>
            <AddServerModal closeModal={handleAddServerModal}/>
          </div>
        )
      }
    </div>
  )
}

export default Layout