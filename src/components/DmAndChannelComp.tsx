
import { IoCloseCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useServerContext } from '../context/ServerContext';
import type {
  ServerMembers
} from "../types/ServerTypes";


const DmAndChannelComp = () => {


  const {sampleUsers}  = useServerContext();


  return (
    <div className='bg-[#111113] shrink-0 w-70 text-white 
    border-x border-[#363c41] h-full'>

      {/* Search bar */}
      <div>
        <div className='bg-[#2c2f33] hover:bg-[#444649] p-2 m-2 
        rounded-md cursor-pointer truncate'> 
        Find or Start a conversation 
        </div>
        <hr className='border border-[#363c41]'></hr>
      </div>

      <div className='overflow-y-auto h-210 scrollbar-thin
      scrollbar-thumb-[#99AAB5] scrollbar-track-transparent'>
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
                <p>{user.user}</p>
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