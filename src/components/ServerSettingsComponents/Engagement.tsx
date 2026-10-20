import { useState } from "react"
import { RiArrowDownSLine } from "react-icons/ri"


const TIMEOUT_OPTIONS = [
  "5 minutes",
  "10 minutes",
  "15 minutes",
  "30 minutes",
  "1 hour",
]

const Engagement = () => {

  const [settingToggle, setSettingToggle] = useState<Record<string, boolean>>({})


  const toggleSetting = (id: string) => {
    setSettingToggle(prev => ({
      ...prev, 
      [id]: !prev[id] // update boolean value
    }))
  }

  console.log(settingToggle['random-welcome'])

  return (
    <div className="grid grid-cols-8 mt-8 relative overflow-auto">

      <div className="col-span-5 font-normal">
        <div >
          <p className="text-2xl">Engagement</p>
          <p className="text-sm pt-1">Manage settings that keep your server active.</p>
        </div>


        {/* System Messages Settings */}
        <div className="mt-12 font-normal">
          <p className="text-2xl">System Messages</p>
          <p className="text-sm pt-1">Configure system event messages sent to your server</p>

          {/* Random Welcome Message Toggle */}
          <div className="mt-7 grid grid-cols-5">
            <div className="col-span-4">
              <p className="font-semibold">Send a random welcome message when someone joins the server.</p>
            </div>
            
            {/* Toggle */}
            <div 
              className={`h-6 w-12 rounded-full cursor-pointer duration-300
                ${settingToggle['random-welcome'] ? "bg-indigo-500" : "bg-[#111111]"}
              `}
              onClick={() => toggleSetting('random-welcome')}
              >
              <div className={`h-4 w-4 bg-white rounded-full m-1 transform 
                ${settingToggle['random-welcome'] ? "translate-x-6" : "translate-x-0"} duration-300`}>
              </div>
            </div>
          </div>

          {/* Prompt members to reply */}
          <div className="mt-7 grid grid-cols-5">
            <div className="col-span-4">
              <p className="font-semibold">Prompt members to reply to welcome messages with a sticker.</p>
            </div>
            
            {/* Toggle */}
            <div 
              className={`h-6 w-12 rounded-full cursor-pointer duration-300
                ${settingToggle['prompt-member'] ? "bg-indigo-500" : "bg-[#111111]"}
              `}
              onClick={() => toggleSetting('prompt-member')}
              >
              <div className={`h-4 w-4 bg-white rounded-full m-1 transform 
                ${settingToggle['prompt-member'] ? "translate-x-6" : "translate-x-0"} duration-300`}>
              </div>
            </div>
          </div>

          {/* Server Boost toggle*/}
          <div className="mt-7 grid grid-cols-5">
            <div className="col-span-4">
              <p className="font-semibold">Send a message when somone boosts a server.</p>
            </div>
            
            {/* Toggle */}
            <div 
              className={`h-6 w-12 rounded-full cursor-pointer duration-300
                ${settingToggle['server-boost'] ? "bg-indigo-500" : "bg-[#111111]"}
              `}
              onClick={() => toggleSetting('server-boost')}
              >
              <div className={`h-4 w-4 bg-white rounded-full m-1 transform 
                ${settingToggle['server-boost'] ? "translate-x-6" : "translate-x-0"} duration-300`}>
              </div>
            </div>
          </div>
          
          {/* Helpful tips */}
          <div className="mt-7 grid grid-cols-5">
            <div className="col-span-4">
              <p className="font-semibold">Send helpful tips for server setup.</p>
            </div>
            
            {/* Toggle */}
            <div 
              className={`h-6 w-12 rounded-full cursor-pointer duration-300
                ${settingToggle['helpful-tips'] ? "bg-indigo-500" : "bg-[#111111]"}
              `}
              onClick={() => toggleSetting('helpful-tips')}
              >
              <div className={`h-4 w-4 bg-white rounded-full m-1 transform 
                ${settingToggle['helpful-tips'] ? "translate-x-6" : "translate-x-0"} duration-300`}>
              </div>
            </div>
          </div>

          {/* System Messages Channel */}
          <div className="mt-7 grid grid-cols-12">
            <div className="col-span-7">
              <p>System Messages Channel</p>
              <p className="text-sm text-gray-500">This is the channel that we send system event messages to.</p>
            </div>

            <div className="col-start-8 col-end-12 pr-4">
              <select className="bg-[#19191b] w-full rounded-md p-2 my-1 focus:outline-[#4567df]
              outline-1 outline-[#393d41] overflow-hidden appearance-none text-gray-500">

                <option value="" className="">#general&nbsp;<p >GENERAL</p></option>
                <RiArrowDownSLine className=""/>
              </select>
            </div>
          </div>

          <hr className=" mt-12 mr-18 border border-[#393d41]"/>
        </div>
        
        {/* Activity Feed Settings */}
        <div className="mt-10">

          <p className="text-2xl">Activity Feed Settings</p>
          <p className="text-sm pt-1">Shows a feed of activity from games and connected apps in this server.</p>

          {/* Activity Feed toggle */}
          <div className="mt-5 grid grid-cols-5">
            
            <div className="col-span-4">
              <p className="text-xl">Display Activity Feed in this server</p>
            </div>
            
            <div 
              className={`h-6 w-12 rounded-full cursor-pointer duration-300
                ${settingToggle['activity-feed'] ? "bg-indigo-500" : "bg-[#111111]"}
              `}
              onClick={() => toggleSetting('activity-feed')}
              >
              <div className={`h-4 w-4 bg-white rounded-full m-1 transform 
                ${settingToggle['activity-feed'] ? "translate-x-6" : "translate-x-0"} duration-300`}>
              </div>
            </div>
          </div>

          <hr className=" mt-12 mr-18 border border-[#393d41]"/>
        </div>

        {/* Default Notification Settings */}
        <div className="mt-12">
          <p>Default Notiffication Settings</p>

          <p className="text-sm font-light text-gray-400 py-2">
            This will determine whether members who have not explicitly set their notification settings receive a
            notification for every message sent in this server or not
          </p>

          <div className="flex flex-col py-5 gap-2">
            <div className="flex items-center gap-2">
              <input type="radio" id="opt1" className="peer sr-only" checked/>
              <label 
                htmlFor="opt1" 
                className="cursor-pointer rounded-full border-2 p-1
                peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-all"
              >
                {/* <!-- Optional inner dot or icon --> */}
                <span className="block h-1 w-1 rounded-full bg-gray-500 opacity-0 peer-checked:opacity-100"></span>
              </label>
              <span className="">All mentions</span>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="radio" id="opt2" className="peer sr-only" />
              <label 
                htmlFor="opt2" 
                className="cursor-pointer rounded-full border-2 p-1
                peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-all"
              >
                {/* <!-- Optional inner dot or icon --> */}
                <span className="block h-1 w-1 rounded-full bg-gray-500 opacity-0 peer-checked:opacity-100"></span>
              </label>
              <span> Only @mentions</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">We highly recommend setting this to only @mentions for a Community Server</p>

          <hr className=" mt-12 mr-18 border border-[#393d41]"/>
        </div>


        {/* Inactive Channel Settings */}
        <div className="mt-12 grid grid-cols-10">

          <div className="col-span-5 mr-2">
            <p>Inactive Channel</p>
            <select className="bg-[#19191b] w-full rounded-md p-2 my-1 focus:outline-[#4567df]
            outline-1 outline-[#393d41] overflow-hidden appearance-none text-gray-500">

              <option value="" className="">#general&nbsp;<p >GENERAL</p></option>
              <RiArrowDownSLine className=""/>
            </select>
            
          </div>

          <div className="col-span-5 mx-2">
            <p>Inactive Time-out</p>
            <select className="bg-[#19191b] w-full rounded-md p-2 my-1 focus:outline-[#4567df]
            outline-1 outline-[#393d41] overflow-hidden appearance-none text-gray-500">

              {TIMEOUT_OPTIONS.map((opt, i) => (
                <option 
                  value={opt} 
                  key={i}
                  className='hover:bg-white/10'
                  >
                    {opt}
                </option>
              ))}
              <RiArrowDownSLine className=""/>
            </select>
          </div>

          <p className="col-span-full text-sm text-gray-500 pt-2">
            Automatically move members to this channel and mute them when they have been idle for longer than the 
            inactive time-out. This does not affect browsers.
          </p>
          
          <hr className=" mt-12 mr-18 border border-[#393d41]"/>
        </div>
      </div>
      
    </div>
  )
}

export default Engagement