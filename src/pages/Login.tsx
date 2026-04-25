import { Link } from "react-router-dom"


const Login = () => {
  return (
    <div>
        Login Page
        <div>
          <div className="p-4">
            <div>
                <label htmlFor="">Username</label>
                <input type="text" name='username'
                placeholder='Enter Username' className='bg-gray-100' />
            </div>
            <div>
                <label htmlFor="">Username</label>
                <input type="text" name='username'
                placeholder='Enter Username' className='bg-gray-100' />
            </div>
          </div>
          <Link 
          type="button"
            to="/register"
            className="bg-blue-300 text-gray-100"
              >Register
            </Link>
        </div>
    </div>
  )
}

export default Login