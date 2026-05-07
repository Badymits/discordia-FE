
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState, type RefObject, type SetStateAction } from 'react';
import { FaEllipsisV, FaSearch, FaUserFriends } from 'react-icons/fa'
import { FiMessageSquare } from 'react-icons/fi'
import { Tooltip } from 'react-tooltip'
import type { User } from '../types/User';
import SearchUsersListLoader from './LoadingComponents/SearchUsersListLoader';
import { BsDiscord } from 'react-icons/bs';
import { useCurrentUser } from '../context/UserContext';
import { getUsers } from '../services/serverService';

interface DirectMessage {
  active: boolean;
  addedFriend: boolean;
  status: string;
  name: string;
  username: string;
  nowPlaying: string;
  bio: string;
  inGame: boolean;
  hoursPlayed: number;
}

interface ActiveFriendComponentProps {
  directMessagesList: DirectMessage [];
  activePanelRef: RefObject<HTMLDivElement>;
  activeDM: number;
  setActiveDM: React.Dispatch<SetStateAction<number>>;
}

const FriendListComponent = ({
  directMessagesList, 
  activePanelRef, 
  activeDM, 
  setActiveDM
}: ActiveFriendComponentProps) => {
  return (
    <div className='w-full'>

      {/* Search Bar */}
      <div className='relative my-4 mx-1'>
        <input 
          placeholder='Search'
          autoFocus
          className='bg-[#111113] focus:outline-blue-400 focus:outline-1 
          text-[#ffffff] p-2 pl-9  rounded-md cursor-pointer w-full' />
        <FaSearch className='absolute left-2 top-2.5 text-gray-500 text-lg'/>
      </div>

      <p className='text-xl my-4 font-thin text-[#ffffff]'>
        Online - {directMessagesList.length}
      </p>
      {directMessagesList.map((dm, i) => (
        <div key={i}
          className='group w-full flex items-center 
          justify-between py-5 border-t px-2 hover:rounded-xl 
          duration-100 border-[#363c41] hover:bg-white/10 cursor-pointer'
          >
          {/* User Icon and user status */}
          <div className='flex gap-2 items-center'>
            <div className='bg-gray-400 h-10 w-10 
              rounded-full  text-xs relative'>
                <div className={`
                  ${dm.status == "online" 
                    ? "bg-green-700" 
                    : dm.status == "idle" 
                      ? "bg-yellow-500"
                      : dm.status == "away"
                        ? "bg-red-700"
                    : "bg-gray-500"} 
                    h-3 w-3 absolute right-0 bottom-0 rounded-full`}
                  >
                </div>
            </div>

            {/* User's name and user tag */}
            <div className='text-white'>
              <div className='flex gap-2'>
                <p>{dm.name}</p>
                <p 
                  className='font-light opacity-0 
                  group-hover:opacity-100 transition-opacity'>
                  {dm.username}
                </p>
              </div>

              <div className='text-[#99AAB5] text-sm font-light'>
                {
                  dm.status === "online" 
                  ? <p>{dm.nowPlaying}</p>
                  : <p>{dm.bio}</p>
                }
              </div>
              
              
            </div>
          </div>
          
          {/* Friend Action buttons */}
          <div className='flex items-center justify-center gap-4 text-white'>
            <FiMessageSquare 
              data-tooltip-id="message"  
              data-tooltip-content="Message"
              className='rounded-full h-7 w-7 p-1 group-hover:bg-gray-800'
            />
            <div className='relative'>
              <FaEllipsisV 
                data-tooltip-id="actions"
                data-tooltip-content="More Actions"
                className='rounded-full h-7 w-7 p-1 group-hover:bg-gray-800'
                onClick={() => setActiveDM(i)}
              />

              {/* More Actions options */}
              {
                activeDM === i && (
                  <div 
                    className={`absolute -right-4 z-50 bg-[#111214] 
                    rounded-xl shadow-xl w-50`} 
                    ref={activePanelRef}
                  >
                    <div className='mx-3'>
                      <button 
                        type='button' 
                        className='w-full text-left my-1 hover:bg-white/10 
                        cursor-pointer px-2 py-1  rounded-md'
                        >
                          Start Video Call
                      </button>

                      <button
                        type='button'
                        className='w-full text-left my-1 px-2 py-1 rounded-md 
                        text-[#f23f42] hover:bg-[#2b1d1d] cursor-pointer'
                      >
                        Remove Friend
                      </button>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
          <Tooltip id="message" place='top' className='z-50'/>
          <Tooltip id="actions" place='top' className='z-50'/>
        </div>
      ))}
    </div>
  )
}


const SearchFriendListComponent = () => {

  const queryClient = useQueryClient();

  const { user } = useCurrentUser();
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")

  // const {
  //   data: fetchedUsers,
  //   isLoading,
  //   isFetching,
  //   refetch,
  // } = useQuery({
  //   ...fetchUsers(searchTerm, user?.UserId || ""),
  //   enabled: !!user?.UserId,
  //   staleTime: 1000 * 5 * 60,
  //   gcTime: 1000 * 5 * 60
  // }) as { 
  //   data: { data: User[] } | undefined; 
  //   isLoading: boolean; 
  //   isFetching: boolean;
  //   refetch: () => void 
  // }

  const {
    data: fetchedUsers,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["searchedUsers", searchTerm, user?.UserId],
    queryFn: () => getUsers(searchTerm, user?.UserId || ""),
    enabled: !!searchTerm,
    staleTime: 1000 * 5 * 60,
    gcTime: 1000 * 5 * 60
  })

  const handleSearchSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nameInputRef.current || !user?.UserId){
      console.error("Cannot Perform search. Please try again later")
      return;
    }

    console.log("Fetching users...")
    console.log("name: ", nameInputRef.current.value)
    setSearchTerm(nameInputRef.current.value)

    refetch();
    // remove existing cache to clear up results
    queryClient.removeQueries({queryKey: ["searchedUsers"]})
  }

  // Loader Skeleton
  if (isLoading && !isFetching){
    return <SearchUsersListLoader />
  }
  console.log(fetchedUsers)

  return (
    <div className='mx-1'>

      {/* Search Bar */}
      <div className='my-4 text-white'>
        
        <div className='text-white'>
          <p className='text-xl font-semibold'>Add Friend</p>
          <p className='my-1'>You can add friends with their Discord usernames.</p>
        </div>
        
        <div className='relative'>
          <form action="" onSubmit={handleSearchSubmit}>
            <input 
              placeholder='Search'
              ref={nameInputRef}
              autoFocus
              className='bg-[#111113] focus:outline-blue-400 focus:outline-1 
              text-[#ffffff] p-3 rounded-md cursor-pointer w-full' 
            />
          </form>
        </div>

        {
          fetchedUsers?.data ? 
          <div className='mt-4'>
            {
              fetchedUsers?.data?.length >= 1 ?
                fetchedUsers?.data.map((user: User) => (
                  <div 
                    key={user.UserId}
                    className='flex items-center justify-between
                    hover:bg-white/10 rounded-md p-2'
                    >
                    <div className='flex items-center gap-2 
                    '>
                      {
                        user.imgUrl 
                        ? <img 
                            src={user.imgUrl} 
                            alt={user.displayName} 
                            className='h-10 w-10 rounded-full'
                          />
                        : <BsDiscord 
                          className='h-10 w-10 bg-indigo-500 rounded-full p-1'
                        />
                      
                      }

                      <div>
                        <p className='font-semibold'>{user.displayName}</p>
                        <p className='text-sm font-light text-gray-400'>{user.username}</p>
                      </div>
                    </div>
                    
                    <div className='font-semibold text-sm'>

                      <button 
                        type='button'
                        className='bg-[#35363b] hover:bg-white/10 duration-100 p-2 
                        cursor-pointer rounded-lg mx-2 w-30'>
                          Send Message
                        </button>

                      <button
                        type='button'
                        className='bg-indigo-500 hover:bg-indigo-400 duration-100 p-2 
                        cursor-pointer rounded-lg mx-2 w-30'
                        >
                        Add Friend
                      </button>
                    </div>
                  </div>
                ))
              :
              <div 
                className='text-2xl w-full text-center 
                font-bold pointer-events-none'>
                No Users Found
              </div>
            }
          </div>
          :
          <div>
            {isFetching ? 
              <div>
                {
                  [...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className='flex items-center justify-between gap-2 my-7'
                    >
                      <div className='flex gap-2'>
                        <div className='h-10 w-10 bg-gray-500 rounded-full animate-pulse px-2'></div>
                        <div>
                          <div className='h-7 w-40 bg-gray-700 rounded-xl animate-pulse my-1'></div>
                          <div className='h-5 w-20 bg-gray-700 rounded-xl animate-pulse my-1'></div>
                        </div>
                      </div>
                      
                      <div className='flex'>
                        <div className='w-30 h-7 rounded-xl bg-gray-700 mx-2 animate-pulse'></div>
                        <div className='w-30 h-7 rounded-xl bg-gray-700 mx-2 animate-pulse'></div>
                      </div>
                    </div>
                  ))
                }
              </div>
              :
              <div>
                No Friends? Loser
              </div>
            }
          </div>  
        }
        
      </div>
    </div>
  )
}

const FriendAndChatComp = ({
    activeDM,
    activeFriendtab,
    setActiveFriendTab,
    directMessagesList,
    setActiveDM,
    activePanelRef
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {

  const queryClient = useQueryClient();
  console.log(directMessagesList)

  const returnFriendList = () => {
    if (activeFriendtab === "online"){
      
      queryClient.removeQueries({ queryKey: ["searchedUsers"] })
      const filteredMessages = directMessagesList?.filter((dm: DirectMessage) => dm.active) || []
      return <FriendListComponent 
        directMessagesList={filteredMessages}
        activePanelRef={activePanelRef}
        activeDM={activeDM}
        setActiveDM={setActiveDM}
      />
    } 
    else if (activeFriendtab === "addfriend") {
      return <SearchFriendListComponent />
    } 
    else {
      queryClient.removeQueries({ queryKey: ["searchedUsers"] })
      const addedFriendList = directMessagesList?.filter((dm: DirectMessage) => dm.addedFriend) || []
      return <FriendListComponent 
        directMessagesList={addedFriendList}
        activePanelRef={activePanelRef}
        activeDM={activeDM}
        setActiveDM={setActiveDM}
      />
    }
  }

  return (
    <div className='bg-[#23272a] flex-1 border-r border-[#363c41]'>

      {/* Friend Options btns */}
      <div className='flex mb-3 items-center gap-4 py-3 text-white border-b border-[#363c41] '>

        <p className='text-2xl'>
          <FaUserFriends className='inline mx-1'/>
          Friends
        </p>

        <button
          onClick={() => setActiveFriendTab("online")}
          className={`${activeFriendtab === "online" ? "bg-[#444649]" : ""}
          px-2 py-1 rounded-md cursor-pointer text-white hover:bg-[#2c2f33]
          `}
        >
          Online
        </button>

        <button
          onClick={() => setActiveFriendTab("all")}
          className={`${activeFriendtab === "all" ? "bg-[#444649]" : ""}
          px-2 py-1 rounded-md cursor-pointer text-white hover:bg-[#2c2f33]
          `}
        >
          All
        </button>

        <button 
          onClick={() => setActiveFriendTab("addfriend")}
          type='button'
          className='bg-indigo-500 px-2 py-1 rounded-md 
          cursor-pointer text-white hover:bg-indigo-400'>
          Add Friend
        </button>
      </div>

      {/* Online/All/Search friends component  */}
      <div className='overflow-hidden mx-2'>
        {returnFriendList()}
      </div>
        
    </div>
  )
}

export default FriendAndChatComp