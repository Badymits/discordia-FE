/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import type { 
  Category, 
  CreateServer, 
  Server, 
  ServerMembers 
} from "../../types/ServerTypes"
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "../../context/UserContext";
import { createServer } from "../../services/serverService";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser } from "../../query/serverQueries";

import { RiHashtag } from "react-icons/ri"
import { GiConsoleController } from "react-icons/gi";
import { IoIosColorPalette } from "react-icons/io";
import { FaLeaf, FaCouch } from "react-icons/fa";
import { LuBookOpenText } from "react-icons/lu";
import { ImPencil2 } from "react-icons/im";
import { CgClose } from 'react-icons/cg'
import { IoIosArrowForward, IoMdAddCircle  } from "react-icons/io";
import { FcGlobe } from "react-icons/fc";
import { CiCamera } from "react-icons/ci";
import { FiCompass } from "react-icons/fi";





const AddServerModal = ({closeModal}: any) => {

  const queryClient = useQueryClient()
  const {user} = useCurrentUser()

  const navigate = useNavigate()

  //console.log(user)

  const {
    data: userData,
    isLoading
  } = useQuery({
    ...fetchUser(user?.UserId || ""),
    enabled: !!user?.UserId
  })

  console.log("new user: ", userData?.data)

  const [newServerName, setNewServerName] = useState<string>(`${userData?.data.userName}'s Server`)
  const [createServerStep, setCreateServerStep] = useState<number>(1)
  const [serverInvite, setServerInvite] = useState<string>(`${user?.userName}'s Server`)

  //const [isLoading, setIsLoading] = useState<boolean>(false)

  const gamingTemplateChannelList: Category[] = [
    {
      categoryName: "Introductions",
      categoryChannels: [
        {
          channelId: "12",
          serverId: 5,
          channelName: "welcome",
          icon: <RiHashtag />
        }
      ]
    },
    {
      categoryName: "Text Channels",
      categoryChannels: [
        {
          channelId: "1",
          serverId: 5,
          channelName: "general",
          icon: <RiHashtag />
        },
        {
          channelId: "2",
          serverId: 5,
          channelName: "announcements",
          icon: <RiHashtag />
        }
      ]
    },
    {
      categoryName: "Events & Activities",
      categoryChannels: [
        {
          channelId: "3",
          serverId: 5,
          channelName: "Lobby",
          icon: <RiHashtag />
        },
        {
          channelId: "4",
          serverId: 5,
          channelName: "Recruitment",
          icon: <RiHashtag />
        },
        {
          channelId: "5",
          serverId: 5,
          channelName: "Game Night",
          icon: <RiHashtag />
        }
      ]
    },
    {
      categoryName: "Game Center",
      categoryChannels: [
        {
          channelId: "6",
          serverId: 5,
          channelName: "league-of-legends",
          icon: <RiHashtag />
        },
        {
          channelId: "7",
          serverId: 5,
          channelName: "valorant",
          icon: <RiHashtag />
        },
        {
          channelId: "8",
          serverId: 5,
          channelName: "dota-2",
          icon: <RiHashtag />
        },
        {
          channelId: "9",
          serverId: 5,
          channelName: "genshin-impact",
          icon: <RiHashtag />
        },
        {
          channelId: "10",
          serverId: 5,
          channelName: "honkai-star-rail",
          icon: <RiHashtag />
        },
        {
          channelId: "11",
          serverId: 5,
          channelName: "zenless-zone-zero",
          icon: <RiHashtag />
        },
      ]
    }
  ]

  const studyTemplateChannelList: Category[] = [
    {
      categoryName: "Entrance",
      categoryChannels: [
        {
          channelId: "7",
          serverId: 5,
          channelName: "greetings",
          icon: <RiHashtag />
        },
        {
          channelId: "8",
          serverId: 5,
          channelName: "please-read",
          icon: <RiHashtag />
        }
      ]
    },
    {
      categoryName: "Text Channels",
      categoryChannels: [
        {
          channelId: "1",
          serverId: 5,
          channelName: "general",
          icon: <RiHashtag />
        },
        {
          channelId: "2",
          serverId: 5,
          channelName: "announcements",
          icon: <RiHashtag />
        }
      ]
    },
    {
      categoryName: "Study Hall",
      categoryChannels: [
        {
          channelId: "3",
          serverId: 5,
          channelName: "library",
          icon: <RiHashtag />
        },
        {
          channelId: "4",
          serverId: 5,
          channelName: "resources",
          icon: <RiHashtag />
        },
        {
          channelId: "5",
          serverId: 5,
          channelName: "homework-help",
          icon: <RiHashtag />
        },
        {
          channelId: "6",
          serverId: 5,
          channelName: "",
          icon: <RiHashtag />
        },
      ]
    }
  ]

  const communityTemplateChannelList: Category[] = [
    {
      categoryName: "Welcome Area",
      categoryChannels: [
        {
          channelId: "1",
          serverId: 5,
          channelName:"welcome-and-rules",
          icon: <RiHashtag />
        },
        {
          channelId: "2",
          serverId: 5,
          channelName:"roles-assignment",
          icon: <RiHashtag />
        },
      ]
    },
    {
      categoryName: "Community Hub",
      categoryChannels: [
        {
          channelId: "3",
          serverId: 5,
          channelName: "general",
          icon: <RiHashtag />
        },
        {
          channelId: "4",
          serverId: 5,
          channelName: "local-events",
          icon: <RiHashtag />
        },
        {
          channelId: "5",
          serverId: 5,
          channelName: "news-and-alerts",
          icon: <RiHashtag />
        },
      ],
    },
    {
      categoryName: "Market Place / Services",
      categoryChannels: [
        {
          channelId: "6",
          serverId: 5,
          channelName: "buy-and-sell",
          icon: <RiHashtag />
        },
        {
          channelId: "7",
          serverId: 5,
          channelName: "recommendations",
          icon: <RiHashtag />
        },
      ],
    },
  ]

  const artistTemplateChannelList: Category[] = [
    {
      categoryName: "Information",
      categoryChannels: [
        {
          channelId: "1",
          serverId: 5,
          channelName:"rules-and-info",
          icon: <RiHashtag />
        },
        {
          channelId: "2",
          serverId: 5,
          channelName:"announcements",
          icon: <RiHashtag />
        },
      ]
    },
    {
      categoryName: "Showcase",
      categoryChannels: [
        {
          channelId: "3",
          serverId: 5,
          channelName:"finished-art",
          icon: <RiHashtag />
        },
        {
          channelId: "4",
          serverId: 5,
          channelName:"sketches-and-wips",
          icon: <RiHashtag />
        },
        {
          channelId: "5",
          serverId: 5,
          channelName:"photography",
          icon: <RiHashtag />
        },
      ]
    },
    {
      categoryName: "Feedback & help",
      categoryChannels: [
        {
          channelId: "6",
          serverId: 5,
          channelName:"critique-my-work",
          icon: <RiHashtag />
        },
        {
          channelId: "7",
          serverId: 5,
          channelName:"technical-help",
          icon: <RiHashtag />
        },
      ]
    },
  ]

  const createServerOptions = [
    {
      name: "Gaming",
      icon: <GiConsoleController className="text-indigo-500"/>
    },
    {
      name: "Study Group",
      icon: <LuBookOpenText className="text-blue-400"/>
    },
    {
      name: "Local Community",
      icon: <FaLeaf className="text-green-300"/>
    },
    {
      name: "Artist",
      icon: <IoIosColorPalette className="text-amber-200"/>
    },
  ]

  const {mutateAsync: createServerMutation, isPending, isError} = useMutation({
    mutationKey: ["createServer"],
    mutationFn: async (payload: CreateServer) => await createServer(payload),

    onMutate: async (createdServer) => {
      // cancel outgoing refetches to handle newly created server
      await queryClient.cancelQueries({queryKey: ["servers", user?.UserId]})

      const previousServers = queryClient.getQueryData(["servers", user?.UserId])

      if (previousServers){
        queryClient.setQueryData(["servers", user?.UserId], (old: Server) => [
          old,
          { 
            serverName: createdServer.serverName,
            serverIcon: createdServer.serverIcon
          }
        ])
      }
      return { previousServers }
    },

    // rollback to old list on failed response
    onError: (context) => {
      queryClient.setQueryData(["servers", user?.UserId], context.message)
    },

    onSuccess: (response) => {

      const serverName = response.data.serverName;
      const serverId = response.data.serverId;

      queryClient.invalidateQueries({ queryKey: ["servers"]})
      closeModal()
      navigate(`/server/${serverName}/${serverId}`)
    
    },
    
  })


  const createServerService = async () => {
    console.log("craeting server...")

    if (!user){
      console.log("Cannot create server. User ID doesn't exist")
      return;
    }

    const payload: CreateServer = {
      serverOwner: userData?.data.userName || "",
      serverName: newServerName,
      userId: user.UserId
    }

    console.log("payload: ", payload)

    createServerMutation(payload)

  }

  const firstStep = () => {
    return (
      <div>

        {/* Modal Header */}
        <div className="text-center mb-10">

          <p className="text-2xl font-semibold my-3">
            Create your Server
          </p>

          <p>Your server is where you and your friends 
            hang out. Make yours and start talking.
          </p>
        </div>
        
        {/* Create Server Btns with template options */}
        <div 
          className="flex flex-col overflow-y-auto h-70 
          scrollbar-thin scrollbar-thumb-[#1e1f22] scrollbar-track-transparent 
          hover:scrollbar-thumb-[#a1a1a1]">

          <div className="flex justify-between items-center mb-3
            p-5 bg-[#232428] rounded-md hover:bg-white/10 
            duration-75 cursor-pointer"
            
            onClick={() => setCreateServerStep(
              createServerStep + 1
            )}
            >

            <div className="flex items-center gap-2 font-thin">
              <ImPencil2 className="text-green-600"/>
              Create Your Own
            </div>
          
            <IoIosArrowForward />
          </div>

          <p className="font-semibold uppercase text-sm mb-2">
            Start From Template
          </p>
          {
            createServerOptions.map((option, i) => (
              <div key={i}
                className="flex justify-between items-center mb-1.5
                p-5 bg-[#232428] rounded-md hover:bg-white/10 
                duration-75 cursor-pointer"
                onClick={() => setCreateServerStep(
                  createServerStep + 1
                )}
              >
                <div className="flex items-center gap-2 font-thin">
                  {option.icon}
                  {option.name}
                </div>

                <IoIosArrowForward />
              </div>
            ))
          }
        </div>
        
        {/* Modal Footer */}
        <div className="text-center mt-4">
          <p>Already have an Invite?</p>
          <button
            type="button"
            className="w-full bg-[#232428] p-2 rounded-md my-2 cursor-pointer
            hover:bg-white/10 durattion-200"
            onClick={() => setCreateServerStep(4)}
          >
            Join A Server
          </button>
        </div>
      </div>
    )
  }

  const secondStep = () => {
    return (
      <div>
        {/* Modal Header */}
        <div className="text-center mb-10">
          <p className="text-2xl font-bold my-3">Tell Us More About Your Server</p>
          <p>In Order to help you with your setup, is your new server for just a 
            few friends or a larger community?</p>
        </div>

        {/* Second Step options */}
        <div className="flex flex-col ">

          <div className="flex justify-between items-center mb-3
            p-5 bg-[#232428] rounded-md hover:bg-white/10 
            duration-75 cursor-pointer"
            
            onClick={() => setCreateServerStep(
              createServerStep + 1
            )}
            >

            <div className="flex items-center gap-2 font-thin">
              <FcGlobe />
              For a Club or Community
            </div>
          
            <IoIosArrowForward />
          </div>

          <div className="flex justify-between items-center mb-3
            p-5 bg-[#232428] rounded-md hover:bg-white/10 
            duration-75 cursor-pointer"
            
            onClick={() => setCreateServerStep(
              createServerStep + 1
            )}
            >

            <div className="flex items-center gap-2 font-thin">
              <FaCouch className="text-fuchsia-400"/>
              For me and My Friends
            </div>
          
            <IoIosArrowForward />
          </div>
        </div>
          
        {/* Footer and back btn */}
        <div className="w-full text-center text-sm mb-10">
          <p>Not sure? You can&nbsp;
            <span className="text-blue-400 
              hover:underline decoration-blue-400 cursor-pointer"
              onClick={() => setCreateServerStep(createServerStep + 1)}
            >
              skip this question
            </span>
            &nbsp;for now
          </p>
        </div>

        <button type="button" 
          className="font-semibold cursor-pointer"
          onClick={() => setCreateServerStep(createServerStep - 1)}
          >
          Back
        </button>
      </div>
    )
  }

  const thirdStep = () => {
    return (
      <div>
        {/* Modal Header */}
        <div className="text-center mb-10">
          <p className="text-2xl font-bold my-3">Customize Your Server</p>
          <p>Give your new server a personality with a name and an
            icon. You can always change it later
          </p>
        </div>

        {/* Third Step Content */}
        <div className=""> 

          <div className="relative h-24 w-24 bg-transparent border-2
            border-dashed rounded-full mx-auto flex 
            flex-col items-center justify-center cursor-pointer">

            <input 
              id="fileInput"
              type="file" 
              accept="image/*"  
              className="opacity-0"
              disabled={isLoading}
            />

            <label htmlFor="fileInput" className="absolute top-5 left-7 w-full 
            cursor-pointer">

              <CiCamera className="text-center text-3xl"/>
              <p className="">Upload</p>
            </label>

            <IoMdAddCircle className="absolute top-0 right-0 
              text-2xl text-[#607de4] z-50"
            />
          </div>       

          {/* Modal Input */}
          <div className="my-6">
            <p className="pb-2">Server Name <span className="text-red-500 pb-5">*</span></p>
            
            <input 
              //placeholder={`Search ${server?.serverName}`}
              value={newServerName}
              disabled={isLoading}
              onChange={(e) => setNewServerName(e.target.value)}
              className='bg-[#111113] outline-[#7289DA] focus:outline-2 capitalize 
              text-[#ffffff] p-2  rounded-md cursor-pointer w-full'
            />

            <p className="text-xs text-gray-400 my-3">
              By creating a server, you agree to Discord's&nbsp;
              <a className="text-blue-400 
                hover:underline decoration-blue-400 cursor-pointer"
                href="https://discord.com/guidelines"
                target="_blank" 
                rel="noopener noreferrer"
                >
                  Community Guidelines.
              </a>
            </p>

          </div>
        </div>

        {/* Third Step button rows */}
        <div className="flex justify-between items-center">
          <button type="button" 
            className="font-semibold cursor-pointer"
            onClick={() => setCreateServerStep(createServerStep - 1)}
            disabled={isPending}
            >
            Back
          </button>

          <button type="button" 
            onClick={() => createServerService()}
            disabled={isPending}
            className="font-semibold cursor-pointer duration-100
            bg-[#607de4] hover:bg-[#7289DA] p-2 rounded-md 
            disabled:bg-[#8fa5f3] disabled:pointer-events-none">
            Create
          </button>
        </div>
      </div>
    )
  }

  const joinServerPage = () => {
    return (
      <div>
        {/* Modal Header */}
        <div className="text-center mb-10">
          <p className="text-2xl font-bold my-3">Join a Server</p>
          <p>Enter an invite below to join an existing server
          </p>
        </div>

        <div className="my-6">
          <p className="pb-2">Server Name <span className="text-red-500 pb-5">*</span></p>
            
          <input 
            value={serverInvite}
            onChange={(e) => setServerInvite(e.target.value)}
            className='bg-[#23272a] border border-[#363c41] 
            outline-[#7289DA] focus:outline-2 text-[#ffffff] 
            p-2  rounded-md cursor-pointer w-full'
          />

          {/* Server Invites Sample and Explore Servers */}
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">Invites should look like</p>

            <div className="bg-[#232428] inline-block px-2 py-1 
              rounded-md mr-2 mb-2 cursor-pointer"
              onClick={() => setServerInvite("hTKzmak")}
              >
              hTKzmak
            </div>

            <div className="bg-[#232428] inline-block px-2 py-1 
              rounded-md cursor-pointer"
              onClick={() => setServerInvite("https://discord.gg/hTKzmak")}
              >
              https://discord.gg/hTKzmak
            </div>

            <div className="bg-[#232428] w-fit px-2 py-1 
              rounded-md cursor-pointer"
              onClick={() => setServerInvite("https://discord.gg/wumpus-friends")}
              >
              https://discord.gg/wumpus-friends
            </div>
          </div>

          <div className="bg-[#1e1f22] hover:bg-white/10 
            duration-100 cursor-pointer p-2 mt-4 rounded-md">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <FiCompass className="text-green-300 text-4xl"/>

                <div className="w-90 text-lg font-bold">
                  Don't have an invite?<br />
                  <p className="text-sm font-normal">Checkout our 
                    discoverable communities in server discoveries
                  </p>
                </div>

              </div>
              
              <IoIosArrowForward />
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div className="flex justify-between items-center">
          <button type="button" 
            className="font-semibold cursor-pointer text-[#7289DA]
            hover:underline decoration-[#7289DA]"
            onClick={() => setCreateServerStep(1)}
            >
            Back
          </button>

          <button type="button" 
            className="ont-semibold cursor-pointer duration-100
            bg-[#607de4] hover:bg-[#7289DA] p-2 rounded-md">
            Join Server
          </button>
        </div>

      </div>
    )
  }

  return (
    <div>
      <motion.div className="flex flex-col p-4 w-120 bg-[#2B2D31] 
        text-white rounded-lg relative cursor-default duration-100"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}  
      >
        <CgClose 
          onClick={closeModal} 
          className="text-2xl absolute right-2 cursor-pointer"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={createServerStep} // Mahalaga 'to para malaman ni Framer na nagbago ang content
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {createServerStep === 1 && firstStep()}
            {createServerStep === 2 && secondStep()}
            {createServerStep === 3 && thirdStep()}
            {createServerStep === 4 && joinServerPage()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default AddServerModal