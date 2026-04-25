
import { FaEllipsisV, FaSearch, FaUserFriends } from 'react-icons/fa'
import { FiMessageSquare } from 'react-icons/fi'
import { Tooltip } from 'react-tooltip'

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

const FriendAndChatComp = ({
    activeDM,
    activeFriendtab,
    setActiveFriendTab,
    directMessagesList,
    setActiveDM,
    activePanelRef
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {

  console.log(directMessagesList)

  const returnFriendList = () => {
    if (activeFriendtab === "online"){
      return directMessagesList?.filter((dm: DirectMessage) => dm.active) || []
    } else if (activeFriendtab === "addfriend") {
      return []
    } 
    else {
      return directMessagesList?.filter((dm: DirectMessage) => dm.addedFriend) || []
    }
  }

  console.log(directMessagesList)
  console.log(activeDM)
  console.log(activeFriendtab)
  return (
    <div className='bg-[#23272a] flex-1 border-r border-[#363c41] py-2 px-5'>
      {/* Friend Options btns */}
      <div className='flex my-6 items-center gap-4 text-white'>
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
          className='bg-[#7289DA] px-2 py-1 rounded-md 
          cursor-pointer text-white hover:bg-[#7289DA]/80'>
          Add Friend
        </button>
      </div>

      {/* Search Bar */}
      <div className='relative my-4'>
        <input 
          placeholder='Search'
          className='bg-[#111113] focus:outline-[#7289DA] focus:outline-2 
          text-[#ffffff] p-2 pl-9  rounded-md cursor-pointer w-full' />
        <FaSearch className='absolute left-2 top-2.5 text-gray-500 text-lg'/>
      </div>
          
      {/* Online/All friends counter  */}
      {
        (activeFriendtab === "online" || activeFriendtab === "all") && (
          <p className='text-xl my-4 font-thin text-[#ffffff]'>
            Online - {returnFriendList().length}
          </p>
        )
      }
          
          {
            returnFriendList().map((dm: DirectMessage, i: number) => (
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
            ))
          }
        </div>
  )
}

export default FriendAndChatComp