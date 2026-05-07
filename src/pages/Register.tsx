import { useState, useRef, useEffect } from "react"
import type { RegisterForm } from "../types/Register";
import { toast, ToastContainer } from "react-toastify";
import { registerUser } from "../services/authUserService";
import { useNavigate } from "react-router-dom";
import { useCurrentUser }  from "../context/UserContext";


interface ResponseObject{
  firstname: string;
  lastname: string;
  email: string
  userName: string;
  displayName: string;
  userId: string;
}

const Register = () => {

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    firstname: "",
    lastname: "",
    email: "",
    userName: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });
  const [isProcessing, setIsProcessing] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null!);
  const navigate = useNavigate();

  const {user} = useCurrentUser();

  const focusInput = () => {
    inputRef.current.focus();
  }

  useEffect(() => {
    focusInput();
  }, [])


  const handleChange = (
    field: keyof RegisterForm,
    value: string
  ) => {
    setRegisterForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRegister = async() => {
    console.log("Saving user...")

    try{
      setIsProcessing(true)

      const response = await registerUser(registerForm)

      console.log(response.data)
      console.log(response)

      if (!response || response.status !== 200){
        //console.log("Cannot proceed to home page for some reason")
        toast.error(`Cannot Complete register process.
          Please try again later`)
        return;
      }

      const userObjStorage = {
        firstName: response.data.firstname,
        lastName: response.data.lastname,
        username: response.data.userName,
        displayname: response.data.displayName,
        email: response.data.email,
        userId: response.data.UserId
      }

      assignValuesToUser({
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        userName: response.data.username,
        displayName: response.data.displayName,
        email: response.data.email,
        userId: response.data.UserId
      })

      // temporary fix. Will add tokens later
      sessionStorage.setItem("UserObj", JSON.stringify(userObjStorage))
      navigate("/")
      return;

    } catch (err: unknown){

      console.log(err)
      toast.error("")
    } finally{

      setIsProcessing(false)
    }
  }

  const assignValuesToUser = ({
    firstname,
    lastname,
    userName,
    displayName,
    email,
    userId
  }: ResponseObject) => {
    if (user) {
      user.Firstname = firstname;
      user.Lastname = lastname;
      user.username = userName;
      user.displayName = displayName;
      user.email = email;
      user.UserId = userId;
    }
  }


  return (
    <div>Register Form
      <div>
        <div >
          <div>
            <label htmlFor="">First Name</label>
            <input 
              type="text" 
              required
              placeholder='Enter First name' 
              className='bg-gray-100 p-1 m-2' 
              value={registerForm?.firstname || ""}
              onChange={(e) => 
                handleChange("firstname", e.target.value)}
              ref={inputRef}
            />
          </div>
          <div>
            <label htmlFor="">Last Name</label>
            <input 
              type="text" 
              required
              placeholder='Enter Last name' 
              className='bg-gray-100 p-1 m-2' 
              value={registerForm?.lastname || ""}
              onChange={(e) => 
                handleChange("lastname", e.target.value)}
              ref={inputRef}
            />
          </div>
          <div>
            <label htmlFor="">Username</label>
            <input 
              type="text" 
              placeholder='Enter Username' 
              className='bg-gray-100 p-1 m-2' 
              value={registerForm?.userName}
              onChange={(e) => 
                handleChange("userName", e.target.value)}
              ref={inputRef}
            />
          </div>
          <div>
            <label htmlFor="">Display Name</label>
            <input 
              type="text" 
              placeholder='Enter Display Name' 
              className='bg-gray-100 p-1 m-2' 
              value={registerForm?.displayName ?? ""}
              onChange={(e) => 
                handleChange("displayName", e.target.value)}
              ref={inputRef}
            />
          </div>
          <div>
            <label htmlFor="">Email Address</label>
            <input 
              type="email" 
              placeholder='Enter Email Address' 
              className='bg-gray-100 p-1 m-2' 
              value={registerForm?.email ?? ""}
              onChange={(e) => 
                handleChange("email", e.target.value)}
              ref={inputRef}
              />
          </div>
          <div>
            <label htmlFor="">Password</label>
            <input 
              type="password" 
              placeholder='Enter Password' 
              className='bg-gray-100 p-1 m-2' 
              value={registerForm?.password ?? ""}
              onChange={(e) => 
                handleChange("password", e.target.value)}
              ref={inputRef}
              />
          </div>
          <div>
            <label htmlFor="">Confirm Password</label>
            <input 
              type="password" 
              placeholder='Confirm Password' 
              className='bg-gray-100 p-1 m-2' 
              value={registerForm?.confirmPassword ?? ""}
              onChange={(e) => 
                handleChange("confirmPassword", e.target.value)}
              ref={inputRef}
              />
          </div>
          <button
            disabled={isProcessing}
            type="button"
            onClick={handleRegister}
            className="bg-blue-300 p-2"
          >
            Register
          </button>
        </div>
      </div>
      <ToastContainer 
        position="top-right"
      />
    </div>
  )
}

export default Register