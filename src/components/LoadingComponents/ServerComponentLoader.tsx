import  { Suspense } from 'react'

const ServerComponentLoader = () => {
  return (
    <Suspense >
      <div className="flex w-full h-screen">
        <div className="bg-[#111113] shrink-0 text-white
        border-x border-[#363c41] truncate w-70">

          <div className="py-3 mb-8 border-b border-[#363c41]">
            <div className="bg-[#1e1e22] h-6 animate-pulse w-40 mx-1 rounded-md"></div>
          </div>

          {/* Channel List Loading animations */}
          {/* create list here not anywhere */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-7">
              <div className="h-5 bg-[#202024] my-2 w-40 animate-pulse gap-2 ml-1  rounded-md"></div>
              {[...Array(2)].map((_, index) => (
                <div key={index} className="h-7 bg-[#202024] my-2  animate-pulse gap-2 mx-4  rounded-md"></div>
              ))}
            </div>
          ))}
        </div>

        {/* Chat container loader */}
        <div className="bg-[#23272a] flex flex-col flex-1 border-r 
            border-[#363c41] text-[#DBDEE1] h-full overflow-hidden">

            <div className="py-6 mb-8 border-b border-[#363c41]"></div>

            <div className="w-200">
              <div className="flex-1 flex flex-col w-full min-h-0 mb-auto overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="mb-7">
                      <div className="flex">
                        <div className="h-10 w-12 rounded-full bg-[#202024]"></div>
                        <div className="h-5 bg-[#202024] my-2 w-full animate-pulse gap-2 ml-1  rounded-md"></div>
                      </div>
                      
                      {[...Array(2)].map((_, index) => (
                        <div key={index} className="h-7 bg-[#202024] my-2 animate-pulse gap-2 ml-15 rounded-md"></div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
            

            <div className=" mt-auto m-3">
              <div className="p-4 flex-none relative h-15 rounded-md bg-[#111314] animate-pulse"></div>
            </div>
        </div>
        
        {/* Server Members */}
        <div className="bg-[#23272a] text-[#DBDEE1] shrink-0 px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-7">
              <div className="h-5 bg-[#202024] my-2 w-60 animate-pulse gap-2 ml-1  rounded-md"></div>
              {[...Array(2)].map((_, index) => (
                <div key={index} className="h-7 bg-[#202024] my-2  animate-pulse gap-2 mx-4  rounded-md"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  )
}

export default ServerComponentLoader