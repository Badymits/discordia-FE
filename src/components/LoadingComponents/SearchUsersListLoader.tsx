

const SearchUsersListLoader = () => {
  return (
    <div className='my-4'>
      <div>
        <p className='h-6 w-50 rounded-xl bg-gray-700 animate-pulse my-2'></p>
        <p className='h-8 w-150 rounded-xl bg-gray-700 animate-pulse my-2'></p>
      </div>


      <div className='p-2 h-10 bg-[#111113] animate-pulse w-full rounded-xl'></div>

      <div className='p-1'>
        {
          [...Array(3)].map((_, i) => (
            <div 
              key={i}
              className='flex items-center justify-between gap-2 my-7'
            >
              <div className='flex gap-2'>
                <div className='h-10 w-10 bg-gray-500 rounded-full animate-pulse px-2'></div>
                <div>
                  <div className='h-7 w-40 bg-gray-700 rounded-xl animate-pulse my-1'></div>
                  <div className='h-5 w-20 bg-gray-700 rounded-xl animate-pulse my-1'></div>
                </div>
              </div>
              
              <div className='flex'>
                <div className='w-30 h-7 rounded-xl bg-gray-700 mx-2 animate-pulse'></div>
                <div className='w-30 h-7 rounded-xl bg-gray-700 mx-2 animate-pulse'></div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default SearchUsersListLoader