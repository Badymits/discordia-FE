/* eslint-disable @typescript-eslint/no-explicit-any */

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

const ActiveFeedAndMembersComp = ({
  directMessagesList
}: any) => {
  return (
    <div className='bg-[#2c2f33] w-100 shrink-0 text-white  
      flex flex-col items-center justify-start gap-4 py-2 px-5'>
        <div className='text-xl self-baseline'>Active Now</div>
        {
          directMessagesList.filter((dm: DirectMessage) => dm.active).map(
              (dm: DirectMessage, i:number) => (
            <div
              key={i}
              className='w-full'>

              <div className={`flex items-center justify-between  shadow-xl
                  ${dm.inGame? "rounded-t-xl" : "rounded-xl"}
                  bg-[#23272a] p-5 w-full  cursor-pointer hover:bg-[#444649]`}
                >
                <div className='flex items-center justify-center gap-3'>
                  <div className='bg-white h-10 w-10 rounded-full'></div>
                  <div>
                    <p>{dm.name}</p>
                    <p className='text-[#99AAB5]'>{dm.nowPlaying}</p>
                  </div>
                </div>

                <div className='bg-gray-600 h-10 w-10 rounded-md'></div>
              </div>

              {
                dm.inGame && (

                <div>
                  <div className='bg-[#202122] rounded-b-xl p-5 w-full shadow-xl
                  flex items-center justify-between '>
                    <div className='flex items-center justify-center gap-3'>
                      <div className='bg-gray-600 h-10 w-10 rounded-md'></div>
                        <p className='text-[#FFFFFF]'>{`Playing for ${dm.hoursPlayed} hours`}</p>
                      </div>
                    </div>
                </div>
                )
              }
            </div>
          ))
        }
      </div>
  )
}

export default ActiveFeedAndMembersComp