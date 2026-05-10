

const ServerListLoader = () => {
  return (
    <div className='bg-[#111113] w-19.5 h-full px-2 shrink-0 flex flex-col items-center'>
      <div className='h-12 w-12.5 p-2 bg-[#23272a] my-3 rounded-xl animate-pulse'></div>
      <hr className='border border-gray-400 w-12.5'/>
      {
        [...Array(5)].map((_, i) => (
          <div
            key={i}
          >
            <div className='h-13 w-13 p-2 bg-[#23272a] my-3 rounded-xl animate-pulse'></div>
          </div>
        ))
      }
    </div>
  )
}

export default ServerListLoader