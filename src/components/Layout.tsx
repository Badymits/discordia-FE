
import { Outlet } from 'react-router-dom'
import ServerList from './ServerList'
import { useCurrentUser } from '../context/UserContext';
import { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import AddServerModal from '../components/ServerComponents/AddServerModal';
import { useServerContext } from '../context/ServerContext';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../query/serverQueries';
import ProfileUIDisplay from './ProfileSettingsComponents/ProfileUIDisplay';


const ProfileUiLoader = () => {
  return (
    <div className='bg-[#2c2f33] flex-1 text-white w-85
      absolute bottom-4 left-2 flex flex-col items-center justify-between gap-4 rounded-xl'>
        <div className='flex items-center w-full px-4 py-3.5 animate-pulse gap-2'>

          <div className='rounded-full h-10 w-10 bg-gray-500'></div>

          <div>
            <div className='rounded-md h-5 bg-gray-600 w-30'></div>
            <div className='rounded-md h-4 mt-1 bg-gray-600 w-20'></div>
          </div>

        </div>
    </div>
  )
}

const Layout = () => {

  //const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [openProfileSettings, setOpenProfileSettings] = useState(false) 
  const [openCreateServerModal, setOpenCreateServerModal] = useState<boolean>(false)

  const { user } = useCurrentUser();

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
    ...fetchUser(user?.userId || ""),
    enabled: !!user?.userId
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

      {
        isLoading 
        ? <ProfileUiLoader />
        : <ProfileUIDisplay 
            openProfileSettings={openProfileSettings}
            setOpenProfileSettings={setOpenProfileSettings}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            userData={userData?.data}
          />
      }

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