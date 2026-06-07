
import { CiSettings } from 'react-icons/ci';
import { GiSoundWaves } from "react-icons/gi";
import { ImPhoneHangUp } from "react-icons/im";
import { BsDiscord } from 'react-icons/bs'
import type { SetStateAction } from 'react';
import { Tooltip } from 'react-tooltip';
import type { ServerUser } from '../../types/User';
import { useCurrentUser } from '../../context/UserContext';

interface ProfileUIProps{
  openProfileSettings: boolean;
  setOpenProfileSettings: React.Dispatch<SetStateAction<boolean>>;
  isHovered: boolean;
  setIsHovered: React.Dispatch<SetStateAction<boolean>>;
  userData: ServerUser;
}

const ProfileUIDisplay = ({
  openProfileSettings,
  setOpenProfileSettings,
  isHovered,
  setIsHovered,
  userData
}: ProfileUIProps) => {

  const {
    isInVoice,
    joinedVoiceChannel,
    setIsInVoice,
    setJoinedVoiceChannel
  } = useCurrentUser();

  return (
    <div className='bg-[#2c2f33] flex-1 text-white w-85
      absolute bottom-4 left-2 flex flex-col items-center justify-between gap-4 rounded-xl '>
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
            userData?.imgUrl ? <img 
            src={userData?.imgUrl || ""} 
            alt={userData?.displayName} 
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
            {userData?.displayName}
            <div className='text-[#99AAB5] text-sm font-light duration-200'>
              {
                isHovered 
                ? `${userData?.displayName}`
                : `${userData?.username}`
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
  )
}

export default ProfileUIDisplay