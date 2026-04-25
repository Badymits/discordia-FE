import { RiHashtag } from "react-icons/ri";
import type { Category, Messages, ServerMembers } from "../types/ServerTypes";



// filter members per channel by ID
const studyChannelMembers = [5, 2, 3]
const personalChannelMembers = [1,2]

export const serversOfLoggedInUser = [
  "Home",
  "Server 1",
  "Server 2"
]

const serverMessages = [
    {
      id: 1,
      user: "UserOne",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      content: "Yo! Kamusta ang progress ng Discord clone?",
      timestamp: "Today at 10:00 AM"
    },
    {
      id: 2,
      user: "DevMaster",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      content: "Solid na, pre! Inayos ko lang yung Flexbox para hindi lumampas sa screen yung input bar.",
      timestamp: "Today at 10:01 AM",
    },
    {
      id: 3,
      user: "UserOne",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      content: "Nice. Paano yung overflow? Gumagana na ba yung auto-scroll?",
      timestamp: "Today at 10:02 AM"
    },
    {
      id: 4,
      user: "CodeLover",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      content: `Test message lang ito para makita natin kung gaano 
      kahaba ang kayang i-render ng chat area natin. Lorem ipsum dolor sit amet, 
      consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      timestamp: "Today at 10:05 AM"
    },
    {
      id: 5,
      user: "DevMaster",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      content: `Eto yung message na medyo mahaba para ma-test yung wrapping 
      ng text sa loob ng message container. Check niyo kung lumalampas sa gilid.`,
      timestamp: "Today at 10:06 AM"
    },
    {
      id: 6,
      user: "UserOne",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      content: "Isang mabilisang chat lang uli.",
      timestamp: "Today at 10:07 AM"
    },
    {
      id: 7,
      user: "SystemBot",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bot",
      content: "Welcome to the server! Please be nice to everyone.",
      timestamp: "Today at 10:08 AM"
    },
    {
      id: 8,
      user: "UserTwo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
      content: "Testing 1 2 3...",
      timestamp: "Today at 10:10 AM"
    },
    {
      id: 9,
      user: "UserTwo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
      content: "Bakit walang sumasagot? Hahaha!",
      timestamp: "Today at 10:11 AM"
    },
    {
      id: 10,
      user: "DevMaster",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      content: "Busy pa kami sa pag-debug nung `Math.random` issue kanina. Nakaka-impure ng life!",
      timestamp: "Today at 10:12 AM"
    },
    {
      id: 11,
      user: "UserOne",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      content: `Heto pa ang isa pang mahabang message para mapuno talaga natin 
      yung viewport. Kailangan nating masiguro na kapag marami nang messages, 
      yung scrollbar ay lalabas lang sa gitnang div at hindi sa buong page. Test test test!`,
      timestamp: "Today at 10:15 AM"
    },
    {
      id: 12,
      user: "CodeLover",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      content: "Pansinin niyo yung margin sa pagitan ng mga messages, dapat consistent yan.",
      timestamp: "Today at 10:16 AM"
    },
    {
      id: 13,
      user: "UserTwo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
      content: "Copy that. Looking good so far.",
      timestamp: "Today at 10:17 AM"
    },
    {
      id: 14,
      user: "DevMaster",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      content: `Last message na 'to para sa overflow test. Kung nakikita mo pa 
      'tong input bar sa baba nang hindi nag-i-scroll ang buong screen, tagumpay tayo pre!`,
      timestamp: "Today at 10:20 AM"
    }
]

export const serverMembers: ServerMembers[] = [
  {
    id: 11,
    user: "UserOne",
    userTag: "TenaciousONE",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    status: "offile",
    dateJoined: "18 Jul 2014"
  },
  {
    id: 2,
    user: "UserTwo",
    userTag: "Noombah2",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    status: "idle",
    dateJoined: "28 Jun 2014"
  },
  {
    id: 3,
    user: "DevMaster",
    userTag: "dev_1224",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    status: "online",
    dateJoined: "10 Oct 2010"
  },
  {
    id: 4,
    user: "CodeLover",
    userTag: "JavaSucks",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    status: "online",
    dateJoined: "26 Feb 2017"
  },
  {
    id: 5,
    user: "jojo",
    userTag: "dibs",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Ryan"
  }
]

export const serverTwoMembers: ServerMembers[] = [
  {
    id: 1,
    user: "SyntaxError",
    userTag: "No_Errors_4_layf",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Syntax",
    dateJoined: "18 Jul 2014"
  },
  {
    id: 2,
    user: "CoffeeAddict",
    userTag: "ItWasAnAccident",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee",
    dateJoined: "18 Jul 2015"
  },
  {
    id: 3,
    user: "DeployMaster",
    userTag: "FrodoBagEnd",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deploy",
    dateJoined: "18 Dec 2014"
  },
  {
    id: 4,
    user: "JuniorDev",
    userTag: "ZXCX_OwO",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Junior",
    dateJoined: "08 Aug 2013"
  },
  {
    id: 5,
    user: "BugHunter",
    userTag: "NoBugIsSafeFromMe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bug",
    dateJoined: "28 Mar 2019"
  },
  {
    id: 6,
    user: "StackOverflowKing",
    userTag: "SO_still_alive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stack",
    dateJoined: "01 Jul 2020"
  },

]

export const serverThreeMembers: ServerMembers[] = [
  {
    id: 4,
    user: "CodeLover",
    userTag: "JavaSucks",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    status: "online",
    dateJoined: "26 Feb 2017"
  },
]

export const serverMessagesMongus = [
  {
    id: 1,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "Yo, gising na! Sidemen Sunday is Among Us day! Sino host?",
    timestamp: "Today at 2:00 PM"
  },
  {
    id: 2,
    user: "DevMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    content: "Ako na, naka-set na 'yung room. 15 players tayo ngayon para gulo.",
    timestamp: "Today at 2:01 PM"
  },
  {
    id: 3,
    user: "CodeLover",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    content: "Pustahan si JJ (UserTwo) na naman unang madi-die dito hahaha.",
    timestamp: "Today at 2:03 PM"
  },
  {
    id: 4,
    user: "UserTwo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    content: "OY! Hindi ako impostor pero bakit laging ako binoboto niyo? It's Vik (UserOne) for sure! I saw him vent in Electrical!",
    timestamp: "Today at 2:05 PM"
  },
  {
    id: 5,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "Liar! I was in Medbay doing the scan. @DevMaster saw me, diba?",
    timestamp: "Today at 2:06 PM"
  },
  {
    id: 6,
    user: "DevMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    content: "Wait, hindi ko nakita. Busy ako sa wires sa Admin. Medyo sus ka rin UserOne, hindi mo naman tinapos 'yung task.",
    timestamp: "Today at 2:07 PM"
  },
  {
    id: 7,
    user: "SystemBot",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bot",
    content: "⚠️ EMERGENCY MEETING CALLED BY: UserTwo",
    timestamp: "Today at 2:08 PM"
  },
  {
    id: 8,
    user: "UserTwo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    content: "VOTE VIK! VOTE VIK! VOTE VIK! If it's not him, vote me next! Seryoso, nakita ko siya sa vent talaga.",
    timestamp: "Today at 2:10 PM"
  },
  {
    id: 9,
    user: "CodeLover",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    content: "Classic JJ desperation. Pero sige, let's go for UserOne. Pag hindi siya, auto-skip tayo next round.",
    timestamp: "Today at 2:11 PM"
  },
  {
    id: 10,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "You guys are throwing! I'm the engineer! Kaya ako nag-vent! Hahaha panuorin niyo 'yung playback sa stream!",
    timestamp: "Today at 2:12 PM"
  },
  {
    id: 11,
    user: "DevMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    content: "Ay oo nga pala, may Engineer role na. My bad. Skip muna, skip muna!",
    timestamp: "Today at 2:15 PM"
  },
  {
    id: 12,
    user: "CodeLover",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    content: "Hala, patay na si DevMaster! Found the body in Security. UserTwo was nearby!",
    timestamp: "Today at 2:16 PM"
  },
  {
    id: 13,
    user: "UserTwo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    content: "WHAT?! I was in Oxygen! This is a setup! You're framing me, CodeLover!",
    timestamp: "Today at 2:17 PM"
  },
  {
    id: 14,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "Huli ka Balmond! Nakita kita sa cams. GGs boys, tapos na ang laro. Next map na tayo sa Airship!",
    timestamp: "Today at 2:20 PM"
  }
];

export const serverMessagesMemes = [
  {
    id: 1,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "POV: You finally fixed the bug but you don't know how.",
    timestamp: "Today at 1:00 PM"
  },
  {
    id: 2,
    user: "DevMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    content: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueGZ3bmZ4Zng5Zng5Zng5Zng5Zng5/3o7TKSjPPrTVONg6CQ/giphy.gif",
    timestamp: "Today at 1:02 PM"
  },
  {
    id: 3,
    user: "CodeLover",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    content: "Junior Dev: *changes 1 line of code*\nSenior Dev: 'Why is the production server on fire?'",
    timestamp: "Today at 1:10 PM"
  },
  {
    id: 4,
    user: "UserTwo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    content: "Me waiting for my code to compile: 💀",
    timestamp: "Today at 1:15 PM"
  },
  {
    id: 5,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "Anong ulam niyo? De joke, mali ng channel. Pero eto meme para hindi spam.",
    timestamp: "Today at 1:20 PM"
  },
  {
    id: 6,
    user: "DevMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    content: "Expectation: AI will take over the world.\nReality: AI is struggling to render a human hand with 5 fingers.",
    timestamp: "Today at 1:25 PM"
  },
  {
    id: 7,
    user: "SystemBot",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bot",
    content: "Reminder: Keep the memes spicy but keep the chat clean! 🌶️",
    timestamp: "Today at 1:30 PM"
  },
  {
    id: 8,
    user: "CodeLover",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    content: "When you use Math.random() as a key and the whole UI starts dancing. 💃",
    timestamp: "Today at 1:45 PM"
  },
  {
    id: 9,
    user: "UserTwo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    content: "https://images.punny.com/programming-humor-css-is-awesome.jpg",
    timestamp: "Today at 1:50 PM"
  },
  {
    id: 10,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "Can we get a 'F' in the chat for my deleted node_modules folder?",
    timestamp: "Today at 2:00 PM"
  }
];

export const serverMessagesNSFW = [
  {
    id: 1,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "Welcome to the dark side. Abandon all hope, ye who enter here. 💀",
    timestamp: "Today at 3:00 PM"
  },
  {
    id: 2,
    user: "CodeLover",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    content: "My sense of humor is so dark, a police officer almost shot it.",
    timestamp: "Today at 3:05 PM"
  },
  {
    id: 3,
    user: "DevMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    content: "Why did the man miss the funeral? He wasn't a 'mourning' person. Get it? Okay, I'll leave.",
    timestamp: "Today at 3:10 PM"
  },
  {
    id: 4,
    user: "UserTwo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    content: "Life is like a box of chocolates... It doesn't last long for fat people.",
    timestamp: "Today at 3:15 PM"
  },
  {
    id: 5,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "Me: *crying because my life is a mess*\nInner me: 'Take a picture, it'll be a great meme for the discord.'",
    timestamp: "Today at 3:20 PM"
  },
  {
    id: 6,
    user: "SystemBot",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bot",
    content: "⚠️ THIS CHANNEL IS MARKED AS NSFW. Proceed with caution (and a thick skin).",
    timestamp: "Today at 3:21 PM"
  },
  {
    id: 7,
    user: "CodeLover",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    content: "My grandpa has the heart of a lion and a lifetime ban from the local zoo.",
    timestamp: "Today at 3:30 PM"
  },
  {
    id: 8,
    user: "DevMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    content: "What’s the difference between a Ferrari and a pile of dead bodies? I don’t have a Ferrari in my garage.",
    timestamp: "Today at 3:45 PM"
  },
  {
    id: 9,
    user: "UserTwo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    content: "Even people who are good for nothing have the capacity to bring a smile to your face. For instance, when you push them down the stairs.",
    timestamp: "Today at 3:55 PM"
  },
  {
    id: 10,
    user: "UserOne",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    content: "I want to die peacefully in my sleep, just like my grandfather. Not screaming in terror like the passengers in his car.",
    timestamp: "Today at 4:00 PM"
  }
];

const serverMessagesSecondServer = [
  {
    id: 101,
    user: "SyntaxError",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Syntax",
    content: "Guys, normal lang ba na may 45 warnings pero zero errors? 🤡",
    timestamp: "Today at 10:00 AM"
  },
  {
    id: 102,
    user: "CoffeeAddict",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee",
    content: "If it works, don't touch it. 'Yan ang golden rule natin dito.",
    timestamp: "Today at 10:05 AM"
  },
  {
    id: 103,
    user: "DeployMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deploy",
    content: "Sino nag-merge sa main nang hindi man lang nag-test sa local? Ubos na naman weekend natin nito.",
    timestamp: "Today at 10:10 AM"
  },
  {
    id: 104,
    user: "JuniorDev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Junior",
    content: "Sorry po, akala ko kasi typos lang 'yung red squiggly lines... 😅",
    timestamp: "Today at 10:12 AM"
  },
  {
    id: 105,
    user: "BugHunter",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bug",
    content: "Don't worry JuniorDev, we've all been there. Pero for now, ikaw muna mag-aayos niyan. Welcome to the team! Haha.",
    timestamp: "Today at 10:15 AM"
  },
  {
    id: 106,
    user: "StackOverflowKing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stack",
    content: "Huwag na kayo mag-away. Copy-paste is the key. Eto 'yung link ng fix.",
    timestamp: "Today at 10:20 AM"
  }
];

const studyChannelMessages = [
  {
    id: 5,
    user: "BugHunter",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bug",
    content: "Guys, na-upload ko na yung PDF notes for Week 4 sa Google Drive. Pa-check na lang kung accessible sa inyo.",
    timestamp: "Today at 2:00 PM"
  },
  {
    id: 2,
    user: "CoffeeAddict",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee",
    content: "Lifesaver ka talaga! Akala ko wala na akong babasahin, hindi kasi ako nakinig sa lecture kanina... Sabog pa yung kape ko. ☕",
    timestamp: "Today at 2:15 PM"
  },
  {
    id: 3,
    user: "DeployMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deploy",
    content: "Nasa Discord Voice Channel ako ngayon, naka-screen share yung Pomodoro timer ko. Join lang kayo kung gusto niyo ng kasabay mag-aral. Focus mode tayo!",
    timestamp: "Today at 2:30 PM"
  }
];

const personalChannelMessages = [
  {
    id: 1,
    user: "SyntaxError",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Syntax",
    content: "Uy Pre!",
    timestamp: "Today at 4:00 PM"
  },
  {
    id: 2,
    user: "CoffeeAddict",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee",
    content: "bakit pre",
    timestamp: "Today at 4:05 PM"
  },
]

// the keys here are the channels of that server
// this is sort of like a table
const ServerChannelMessageObj = {
  "general": {
    messages: serverMessages,
    members: serverMembers
  },
  "sidemen-amongus": {
    messages: serverMessagesMongus,
    members: serverMembers
  },
  "memes": {
    messages: serverMessagesMemes,
    members: serverMembers
  },
  "nsfw": {
    messages: serverMessagesNSFW,
    members: serverMembers
  }
}

const serverOneChannelList: Category[] = [
  {
    channelSectionName: "Text Channels",
    channels: [
      {
        channelId: 1,
        serverId: 1,
        channelName: "general",
        icon: <RiHashtag />,
      },
      {
        channelId: 2,
        serverId: 1,
        channelName: "sidemen-amongus",
        icon: <RiHashtag />
      }
    ]
  },
  {
    channelSectionName: "Sample Channels",
    channels: [
      {
        channelId: 3,
        serverId: 1,
        channelName: "random-shit-here",
        icon: <RiHashtag />,
      },
      {
        channelId: 4,
        serverId: 1,
        channelName: "memes",
        icon: <RiHashtag />
      },
      {
        channelId: 5,
        serverId: 1,
        channelName: "nsfw",
        icon: <RiHashtag />,
        isPrivate: true
      }
    ]
  }
]

const serverTwoChannelList: Category[] = [
  {
    channelSectionName: "Text Channels",
    channels: [
      {
        channelId: 1,
        serverId: 2,
        channelName: "general",
        icon: <RiHashtag />,
      },
      {
        channelId: 2,
        serverId: 2,
        channelName: "study",
        icon: <RiHashtag />
      },
      {
        channelId: 3,
        serverId: 2,
        channelName: "personal-things",
        icon: <RiHashtag />,
        isPrivate: true
      }
    ]
  }
] 
 
// list of channels with members allowed
const ServerChannelObj = {
  "general": {
    messages: serverMessagesSecondServer,
    members: serverTwoMembers
  },
  "study": {
    messages: studyChannelMessages,
    members: serverTwoMembers.filter(member => studyChannelMembers.includes(member.id))
  },

  "personal-things": {
    messages: personalChannelMessages,
    members: serverTwoMembers.filter(member => personalChannelMembers.includes(member.id))
  }

}


const serverThreeChannelList: Category[] = [
  {
    channelSectionName: "Text Channels",
    channels: [
      {
        channelId: 1,
        serverId: 3,
        channelName: "general",
        icon: <RiHashtag />,
      },
    ]
  },
  {
    channelSectionName: "The Zone",
    channels: [
      {
        channelId: 2,
        serverId: 3,
        channelName: "the-zone",
        icon: <RiHashtag />,
      },
    ]
  }
]

const serverFourChannelList: Category[] =[
  {
    channelSectionName: "Text Channels",
    channels: [
      {
        channelId: 1,
        serverId: 4,
        channelName: "general",
        icon: <RiHashtag />,
      },
    ]
  },
]

const Server3ChannelObj = {
  "general": {
    messages: [],
    members: serverThreeMembers
  },
  "the-zone": {
    messages: [],
    members: []
  }
}

const ChannelsByServerID = {
  1: serverOneChannelList,
  2: serverTwoChannelList,
  3: serverThreeChannelList,
  4: serverFourChannelList
}

const directMessageDevMaster: Messages[] = [
  {
    id: 1,
    user: "Dev Master",
    userTag: "dev_master_01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    timestamp: "Today at 2:30 PM",
    message: "Pre, kumusta 'yung transition ng User Details sidebar? Na-fix mo na 'yung layout bug?",
    contentWithImg: false,
    serverId: "aaa",
    channelId: "aaaa"
  },
  {
    id: 2,
    user: "dibs",
    userTag: "dibs",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=StressedDev",
    timestamp: "Today at 2:32 PM",
    isReply: true,
    message: "Oo pre, salamat! 'Yung flex-1 at min-w-0 lang pala ang kulang. Naka bg-green-500 pa ako kanina para ma-debug haha.",
    contentWithImg: false,
    serverId: "aaa",
    channelId: "aaaa"
  },
  {
    id: 3,
    user: "Dev Master",
    userTag: "dev_master_01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    timestamp: "Today at 2:33 PM",
    message: "Hahaha debugging with colors, classic! Check mo 'to, heto 'yung screenshot ng scroll issue sa mobile view.",
    contentWithImg: false,
    serverId: "aaa",
    channelId: "aaaa"
  },
  {
    id: 4,
    user: "Dev Master",
    userTag: "dev_master_01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    timestamp: "Today at 2:33 PM",
    message: "https://images.unsplash.com/photo-1555066931-4365d14bab8c", // Sample image URL
    contentWithImg: true,
    serverId: "aaa",
    channelId: "aaaa"
  },
  {
    id: 5,
    user: "dibs",
    userTag: "dibs",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=StressedDev",
    timestamp: "Today at 2:35 PM",
    message: "Kita ko na. Mukhang kailangan nating i-override 'yung h-screen sa mobile browsers dahil sa address bar. Nakaka-stress din 'tong CSS, dumadami na puting buhok ko lol.",
    contentWithImg: false,
    serverId: "aaa",
    channelId: "aaaa"
  },
  {
    id: 6,
    user: "Dev Master",
    userTag: "dev_master_01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    timestamp: "Today at 2:36 PM",
    content: "Relax ka lang, par. Use `dvh` (Dynamic Viewport Height) unit para sa mobile. Huwag mong paabutin sa Marie Antoinette syndrome 'yan! Nga pala, nag-gym ka na?",
    contentWithImg: false,
  },
  {
    id: 7,
    user: "dibs",
    userTag: "dibs",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=StressedDev",
    timestamp: "Today at 2:38 PM",
    isReply: true,
    content: "Leg Day bukas! Squats and RDLs. Rest muna ngayon bago mag-Monday New Split (ULPPL).",
    contentWithImg: false,
  },
  {
    id: 8,
    user: "Dev Master",
    userTag: "dev_master_01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    timestamp: "Today at 2:40 PM",
    content: "Nice. Sige, push mo muna 'yung flex fix sa main branch. Merge ko na lang later.",
    contentWithImg: false,
  }
]

export const voiceChannelMembers: ServerMembers[] = [
  {
    id: 1,
    user: "SyntaxError",
    userTag: "No_Errors_4_layf",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Syntax",
    serverMemberStatus: {
      userId: "1A",
      isInVoiceChannel: true,
      isTimedOut: false,
      timeOutStatus: "none"
    }
  },
  {
    id: 2,
    user: "BugHunter",
    userTag: "NoBugIsSafeFromMe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bug",
    serverMemberStatus: {
      userId: "2B",
      isInVoiceChannel: true,
      isTimedOut: false,
      timeOutStatus: "none"
    }
  },
  {
    id: 3,
    user: "JuniorDev",
    userTag: "ZXCX_OwO",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Junior",
    serverMemberStatus: {
      userId: "3C",
      isInVoiceChannel: true,
      isTimedOut: false,
      timeOutStatus: "none",
      isMuted: true
    }
  }

]

export const getConvoByUser = (userName: string) => {
  if (userName === "DevMaster"){
    return directMessageDevMaster
  }
}

export const getChannelByKey = (channelName: string, serverId: number) => {

  if (serverId === 1){
    return ServerChannelMessageObj[channelName as keyof typeof ServerChannelMessageObj]
  } else if (serverId === 2){
    return ServerChannelObj[channelName as keyof typeof ServerChannelObj]
  } else if (serverId === 3){
    return Server3ChannelObj[channelName as keyof typeof Server3ChannelObj]
  }else {
    return []
  }
  
}


export const getChannelsByServerID = (serverId: number) => {
  return ChannelsByServerID[serverId as keyof typeof ChannelsByServerID]
}


