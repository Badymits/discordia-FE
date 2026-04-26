
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import {  useServerContext } from '../context/ServerContext';


import { BiPlusCircle } from 'react-icons/bi'
import { BsDiscord } from 'react-icons/bs'
import type { Server } from '../types/ServerTypes';

import { fetchServersList } from '../query/serverQueries';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '../context/UserContext';

interface ServerListProps{
  serverList: Server[];
  handleFunction: () => void;
}

const ServerList = (
  { 
    //serverList,
    handleFunction
}: ServerListProps) => {

  const { serverId } = useParams()
  const { user } = useCurrentUser()
  const {
    setServer
  } = useServerContext();

  const navigate = useNavigate()

  console.log(user)

  const { data, isLoading } = useQuery({
    ... fetchServersList(user?.UserId || ""),
    enabled: !!user?.UserId, // Prevents fetching data until UserID has value
    staleTime: 1000 * 5 * 60,
    gcTime: 1000 * 5 * 60
  })

  const serverList: Server[] = data?.data || []

  console.log("testing server list: ", serverList)

  const setServerObject = (
    serverId: number | string,
    serverName: string, 
    randomAssBoboTS: number,
  ) => {

     setServer({
      serverId: serverId,
      serverName: serverName,
      members: 0,
      description: "",
      isAddButton: false
    })

    const urlParams = serverId ? serverId : randomAssBoboTS + 1

    return navigate(`/server/${serverName}/${urlParams}`)
  }

  const getInitials = (serverName: string) => {
    return serverName
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }


  if (isLoading) return <div>Loading Server List...</div>

  return (
    <div className='bg-[#111113] w-19.5 h-full px-2 shrink-0'>
    
      <div className='w-full flex flex-col items-center'> 
        {/* Home Btn */}
        <Link to="/">
          <BsDiscord className='
          text-4xl text-[#7289DA] my-3 h-12 w-12.5 p-2 
          cursor-pointer rounded-xl bg-[#23272a] hover:bg-[#7289DA] hover:text-white'/>
        </Link>

        <hr className='border border-gray-400 w-12.5'/>
        {serverList!.map((server: Server, i: number) => (
          <button key={i}
            
            onClick={() => {
              if (!server.isAddButton){
                setServerObject(
                  server.serverId,
                  server.serverName, 
                  i,
                )
              } 
              else {
                handleFunction()
              }
            }}
            data-tooltip-id="my-server-tooltip" // Shared ID
            data-tooltip-content={server.serverName}
            className='h-13 w-13  flex 
            cursor-pointer items-center justify-center rounded-xl my-2 duration-200`
            relative group opacity-100
            '>
            
            {/* small UI that pops up when hovered */}
            <div 
              className={`absolute -left-4 w-1 bg-white rounded-r-full 
              transition-all duration-300 
              h-0 group-hover:h-5 
              /* Logic: 0 height pag normal, maliit pag hover, malaki pag active */
              /* Kung ito ang current server, gawin nating height-10 */

              ${serverId ? "h-5 w-1.5" : ""}
              `
            } 
            />
            
            {/* Server Icon */}

            {
              server.serverIcon 
              ? <img 
                src={server.serverIcon || ""}
                alt={server.serverName}
                className='h-full w-full rounded-xl'
              />
              : <div className={`h-full w-full rounded-xl font-semibold text-white
                duration-100 flex items-center justify-center

                ${serverId === server.serverId 
                  ? "bg-indigo-500" 
                  : "bg-[#23272a] hover:bg-[#383c3f]"
                }`}>
                {getInitials(server.serverName)}
              </div>
            }
          </button>
        ))}

        {/* Add server button */}
        <button
          type='button'
          data-tooltip-id="my-server-tooltip" 
          data-tooltip-content="Create Server"
          className='h-13.5 w-12.5 bg-white hover:bg-[#7289DA] flex 
            cursor-pointer items-center justify-center rounded-xl my-2 duration-200`
            relative group opacity-100'
            onClick={() => handleFunction()}
        >
          <BiPlusCircle className='text-2xl group-hover:text-white
          duration-100 text-gray-500'/> 
        </button>

        <Tooltip id="my-server-tooltip" place='right' className='z-50'/>
      </div>
    </div>
  )
}

export default ServerList