
import { Link } from 'react-router-dom'

const DummyHome = () => {
  return (
    <div className='bg-gray-300 h-screen text-2xl'>
      Dummy Home
      <Link to={`/server/${1}`}>
        Click here to go to server
      </Link>
    </div>
  )
}

export default DummyHome