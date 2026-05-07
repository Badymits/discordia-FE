/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { CgClose } from 'react-icons/cg'

import { 
  MdAccountCircle, 
  MdOutlinePrivacyTip,
  MdNotificationsActive 
} from "react-icons/md";
import { TbApps } from "react-icons/tb";
import { SiGnuprivacyguard } from "react-icons/si";
import { useCurrentUser } from '../context/UserContext';
import { FaSearch, FaMicrophone } from 'react-icons/fa';
import { IoColorPaletteOutline, IoTextSharp, IoLanguage, IoGameControllerOutline } from "react-icons/io5";
import { BsUniversalAccessCircle } from "react-icons/bs"
import { LuActivity, LuMonitorPlay } from "react-icons/lu";
import { MdCoPresent } from "react-icons/md";
import { TfiLayoutMediaOverlayAlt } from "react-icons/tfi";
import { CiLogout } from "react-icons/ci";
import { BsDiscord } from 'react-icons/bs'

import EditProfile from './ProfileSettingsComponents/EditProfile';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../query/serverQueries';

const ProfileSettings = ( {closeSettings}: any) => {

  // const queryClient = useQueryClient()
  const {user} = useCurrentUser();
  const [activeTab, setActiveTab] = useState("My Account")

  const {
    data: userData,
  } = useQuery({
    ...fetchUser(user?.UserId || ""),
    enabled: !!user?.UserId
  })

  const UserSettings = [
    {
      name:"My Account",
      description: "Change your username, email, and password",
      icon: <MdAccountCircle />
    },
    {
      name:"Privacy & Safety",
      description: "Adjust your privacy and safety settings",
      icon: <MdOutlinePrivacyTip />
    },
    {
      name:"Authorized Apps",
      description: "View and revoke access to authorized applications",
      icon: <TbApps />
    },
    {
      name: "Content & Socials",
      description: "Manage your connected social accounts and content preferences",
      icon: <SiGnuprivacyguard />
    },
    {
      name: "Notifications",
      description: "Customize your notification settings",
      icon: <MdNotificationsActive />
    }
  ]

  const AppSettings = [
    {
      name: "Appearance",
      description: "Customize the appearance of the app",
      icon: <IoColorPaletteOutline />
    },
    {
      name: "Accessibility",
      description: "Adjust accessibility settings for a better experience",
      icon: <BsUniversalAccessCircle />
    },
    {
      name: "Voice & Video",
      description: "Configure your voice and video settings",
      icon: <FaMicrophone />
    },
    {
      name: "Text & Images",
      description: "Manage how text and images are displayed",
      icon: <IoTextSharp />
    },
    {
      name: "Language",
      description: "Select your preferred language",
      icon: <IoLanguage />
    }
  ]

  const ActivitySettings = [
    {
      name: "Activity Status",
      description: "Manage your activity status and what others can see",
      icon: <LuActivity />
    },
    {
      name: "Game Activity",
      description: "Control which games you want to display as your activity",
      icon: <IoGameControllerOutline />
    },
    {
      name: "Rich Presence",
      description: "Enable or disable rich presence for supported games",
      icon: <MdCoPresent />
    },
    {
      name: "Overlay",
      description: "Configure the in-game overlay settings",
      icon: < TfiLayoutMediaOverlayAlt />
    },
    {
      name: "Streamer Mode",
      description: "Activate streamer mode to hide sensitive information while streaming",
      icon: <LuMonitorPlay />
    }
  ]
  return (
    <div className='flex w-350 h-195 mx-5
      shadow-2xl animate-in fade-in duration-200 text-white z-999'>
        
      <div className=' bg-[#202122] w-70 p-4 shrink-0 
      rounded-l-2xl text-sm overflow-auto scrollbar-thin
      scrollbar-thumb-[#99AAB5] scrollbar-track-transparent'>
        
        {/* Username and profile pic */}
        <div className='flex justify-between items-center w-full
          hover:bg-white/10 p-2 rounded-md cursor-pointer'
          onClick={() => setActiveTab("Edit Profile")}
          >

          <div className='flex gap-2'>
            {
              userData?.data.imgUrl
              ? <img 
                  src={userData?.data.imgUrl} 
                  alt={userData?.data.displayName}
                  className='h-12 w-12 rounded-full object-cover bg-black-10' 
                />
              : <BsDiscord className='bg-indigo-500 h-12 w-12 rounded-full p-2'/>
            }
            

            <div>
              <h2 className='text-xl font-semibold'>{userData?.data.userName}</h2>
              <p className='font-light cursor-pointer hover:underline'>Edit Profile</p>
            </div>
          </div>

          <div></div>
        </div>

        {/* Search Bar */}
        <div className='relative my-4'>
          <input 
            placeholder='Search'
            className='bg-[#111113] focus:outline-[#7289DA] focus:outline-2 
            text-[#ffffff] p-2 pl-9  rounded-md cursor-pointer w-full' />
          <FaSearch className='absolute left-2 top-2.5 text-gray-500 text-lg'/>
        </div>

        {/* User Settings */}
        <div className='text-[#99AAB5]'>
          <h1 className='text-sm pb-3a'>User Settings</h1>
          {
            UserSettings.map((setting) => (
              <div 
                key={setting.name} 
                className={`flex items-center gap-3 p-2 my-1
                  rounded-md cursor-pointer hover:bg-[#111113]
                  ${activeTab === setting.name ? "bg-[#2c2f33]" : ""}  
                `}
                onClick={() => setActiveTab(setting.name)}  
              >
                <div className='text-xl'>{setting.icon}</div>
                <div>
                  <h3 className='text-sm font-semibold'>{setting.name}</h3>
                  <p className='text-xs text-gray-500'>{setting.description}</p>
                </div>
              </div>
            ))
          }
        </div>

        <hr className='border border-gray-400 w-full my-4'/>

        {/* App Settings */}
        <div className='text-[#99AAB5]'>
          <h1 className='text-sm pb-3a'>App Settings</h1>
          {
            AppSettings.map((setting) => (
              <div
                key={setting.name}
                className={`flex items-center gap-3 p-2 my-1
                  rounded-md cursor-pointer hover:bg-[#111113]
                  ${activeTab === setting.name ? "bg-[#2c2f33]" : ""}  
                `}
                onClick={() => setActiveTab(setting.name)} 
              >
                <div className='text-xl'>{setting.icon}</div>
                <div>
                  <h3 className='text-sm font-semibold'>{setting.name}</h3>
                  <p className='text-xs text-gray-500'>{setting.description}</p>
                </div>
              </div>
            ))
          }
        </div>

         <hr className='border border-gray-400 w-full my-4'/>

        {/* Activity Settings */}
        <div className='text-[#99AAB5]'>
          <h1 className='text-sm pb-3a'>Activity Settings</h1>
          {
            ActivitySettings.map((setting) => (
              <div
                key={setting.name}
                className={`flex items-center gap-3 p-2 my-1
                  rounded-md cursor-pointer hover:bg-[#111113]
                  ${activeTab === setting.name ? "bg-[#2c2f33]" : ""}  
                `}
                onClick={() => setActiveTab(setting.name)} 
              >
                <div className='text-xl'>{setting.icon}</div>
                <div>
                  <h3 className='text-sm font-semibold'>{setting.name}</h3>
                  <p className='text-xs text-gray-500'>{setting.description}</p>
                </div>
              </div>
            ))
          }
        </div>

        <hr className='border border-gray-400 w-full my-4'/>
        
        <button
          type='button'
          className='w-full text-left my-1 px-2 py-3 rounded-lg 
          text-[#f23f42] hover:bg-[#2b1d1d] cursor-pointer'
        >
          <CiLogout className='inline text-xl mr-2'/>
          Log Out
        </button>

        <div className='text-xs text-[#99AAB5] mt-4'>
          stable 500870 (66413e7) Host 1.0.9225 x64 (75673) Build Override: N/A Windows 11 64-bit (10.0.26100)
        </div>
        
      </div> 

      <div className='bg-[#23272a] w-full px-2 flex-1 rounded-r-2xl 
          h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#99AAB5] 
          scrollbar-track-transparent relative'>
        <div className='flex justify-between p-4 items-center border-b border-gray-700'>
          {activeTab}

          <div>
            <CgClose onClick={closeSettings} className='text-2xl cursor-pointer hover:text-gray-400'/>
          </div>
        </div>

        <div className='p-5 w-full'>
          
          {
            activeTab === "Edit Profile" ? 
            <EditProfile /> 
            : 
            "Content Here"
          }
        </div>
        
      </div>
    </div>
  )
}

export default ProfileSettings