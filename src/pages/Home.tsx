
import { useEffect, useRef, useState } from 'react'

import FriendAndChatComp from '../components/FriendAndChatComp'
import ActiveFeedAndMembersComp from '../components/ActiveFeedAndMembersComp'


  {/* <div className='bg-[#7289DA] h-[50px]'>Color</div>
          <div className='bg-[#FFFFFF] h-[50px]'>Color</div>
          <div className='bg-[#99AAB5] h-[50px]'>Color</div>
          <div className='bg-[#2c2f33] h-[50px]'>Color</div>
          <div className='bg-[#23272a] text-white h-[50px]'>Color</div>
          <div className='bg-[#000000] text-white h-[50px]'>Color</div> */}

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

const Home = () => {


  //const [actionTabItems, setActionTabItems] = useState(false)
  const [activeDM, setActiveDM] = useState(-1)

  // State for active friend tab (Online, All, Add Friend)
  const [activeFriendTab, setActiveFriendTab] = useState("online")

  const activePanelRef = useRef<HTMLDivElement>(null!);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activePanelRef.current && !activePanelRef.current.contains(event.target as Node)) {
        setActiveDM(-1); // Close the action tab when clicking outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [])

   const directMessagesList: DirectMessage[] = [
    {
      name: "John Doe",
      username: "JohnDoe",
      status: "online",
      bio: `Devz 4 lyf`,
      active: true,
      nowPlaying: "Valorant",
      hoursPlayed: 100,
      inGame: true,
      addedFriend: true
    },
    {
      name: "Jiminy Doe",
      username: "The_J_Doe",
      status: "away",
      bio: `I like turtles`,
      active: true,
      nowPlaying: "League of Legends",
      hoursPlayed: 100,
      inGame: false,
      addedFriend: true
    },
    {
      name: "Jimmy Doe",
      username: "Jimmy_Doe",
      status: "idle",
      bio: `I like turtles too`,
      active: true,
      nowPlaying: "Dota 2",
      hoursPlayed: 100,
      inGame: false,
      addedFriend: true
    },
    {
      name: "Jane Doe",
      username: "Jane_Doe_123",
      status: "offline",
      bio: `I like turtles too but I also like dogs`,
      active: false,
      nowPlaying: "Apex Legends",
      hoursPlayed: 100,
      inGame: true,
      addedFriend: false
    },
    {
      name: "Joanna Doe",
      username: "DoeDoe_Joanna",
      status: "offline",
      bio: `I like turtles too but I also like cats`,
      active: false,
      nowPlaying: "Call of Duty",
      hoursPlayed: 100,
      inGame: true,
      addedFriend: true
    },
    {
      name: "Definitely Not Epstein",
      username: "Epstein DidntKillHimself",
      status: "online",
      bio: `I like children`,
      active: true,
      nowPlaying: "My Island",
      hoursPlayed: 100,
      inGame: true,
      addedFriend: true
    },
  ]

  return (
    <div className='flex w-full '>

      {/* DM and Friend List / Text Inputs */}
      <FriendAndChatComp 
        activeDM={activeDM}
        activeFriendtab={activeFriendTab}
        setActiveFriendTab={setActiveFriendTab}
        directMessagesList={directMessagesList}
        setActiveDM={setActiveDM}
        activePanelRef={activePanelRef}
      />

      {/* Active Now Lists/ Server  Member Lists */}
      <ActiveFeedAndMembersComp 
        directMessagesList={directMessagesList}
      />
      
    </div>
  )
}

export default Home