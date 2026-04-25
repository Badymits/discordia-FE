
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {  RiDeleteBinLine  } from "react-icons/ri";
import ServerProfile from "../ServerSettingsComponents/ServerProfile";
import ServerTag from "../ServerSettingsComponents/ServerTag";

interface ServerSettingsProps{
  closeModal: () => void;
  serverName: string
}

const TAB_COMPONENTS: Record<string, React.ReactNode> = {
  profile: <ServerProfile />,
  serverTag: <ServerTag />
}

const ServerSettings = ({
  closeModal,
  serverName
}: ServerSettingsProps) => {

  const [activeTab, setActiveTab] = useState<number>(101)
  const [selectedTabCode, setSelectedTabCode] = useState<string>("profile")

  const serverSettings = [ 
    {
      sectionName: serverName,
      sectionSettings:[
        {
          id: 101,
          name: "Server Profile",
          tabCode: "profile",
          icon: ""
        },
        {
          id: 102,
          name: "Server Tag",
          tabCode: "serverTag",
          icon: ""
        }
      ]
    },
    {
      sectionName: "People",
      sectionSettings: [
        {
          id: 103,
          name: "Members",
          tabCode: "members",
          icon: ""
        },
        {
          id: 104,
          name: "Roles",
          tabCode: "roles",
          icon: ""
        },
        {
          id: 105,
          name: "Invites",
          tabCode: "invites",
          icon: ""
        },
        {
          id: 106,
          name: "Access",
          tabCode: "access",
          icon: ""
        }
      ]
    },
    {
      sectionName: "Expression",
      sectionSettings: [
        {
          id: 107,
          name: "Emojis",
          icon: "",
          tabCode: "emojis"
        },
        {
          id: 108,
          name: "Stickers",
          icon: "",
          tabCode: "stickers"
        },
        {
          id: 109,
          name: "Soundboard",
          icon: "",
          tabCode: "soundboard"
        }
      ]
    },
    {
      sectionName: "Moderation",
      sectionSettings: [
        {
          id: 110,
          name: "Safety Setup",
          tabCode: "safetySetup",
          icon: ""
        },
        {
          id: 111,
          name: "Audit Log",
          tabCode: "auditLog",
          icon: ""
        },
        {
          id: 112,
          name: "Bans",
          tabCode: "bans",
          icon: ""
        },
        {
          id: 113,
          name: "AutoMod",
          tabCode: "autoMod",
          icon: ""
        }
      ]
    },
    {
      sectionName: "",
      sectionSettings: [
        {
          id: 114,
          name: "Server Template",
          tabCode: "serverTemplate"
        },
        {
          id: 115,
          name: "Delete Server",
          tabCode: "delete",
          icon: <RiDeleteBinLine />
        }
      ]
    }
  ]


    
    
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#23272a]
      grid grid-cols-24 font-thin">
      
      <div className="absolute right-3 top-3 text-[#c6ccd3] flex flex-col items-center">
        <IoIosCloseCircleOutline onClick={closeModal} className="text-5xl "/>
        <p>ESC</p>
      </div>
      

      <div className="col-span-9 bg-[#111113] pr-5 text-[#c6ccd3]">
        <div className="self-center justify-self-end w-60 mt-15 h-full overflow-auto font-semibold">
          {serverSettings.map((setting, i) => (
            <div
              key={i}
              className="py-1 border-b border-[#363c41] "
              >
                <p className="text-sm mt-2 px-2 text-gray-500 uppercase pointer-events-none">
                  {setting.sectionName}
                </p>
                {setting.sectionSettings.map((s) => (
                  <div
                    key={s.id}
                    className={`py-1.5 my-1 text-base cursor-pointer  rounded-md 
                    ${activeTab === s.id ? "bg-white/10 text-gray-300" : "text-gray-400"}
                    ${s.icon ? "text-red-400 hover:bg-red-950" : "hover:text-gray-300 hover:bg-white/10"}
                     duration-150 px-2`}

                     onClick={() => {
                        setSelectedTabCode(s.tabCode)
                        setActiveTab(s.id)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        {s.name}
                        {s.icon}
                      </div>
                      
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="text-white p-5 col-span-15 ">
        {TAB_COMPONENTS[selectedTabCode] }
      </div>
    </div>
  )
}

export default ServerSettings