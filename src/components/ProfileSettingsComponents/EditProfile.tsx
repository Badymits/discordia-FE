import { useState, type ChangeEvent, useRef, useEffect } from "react"
import { useCurrentUser } from "../../context/UserContext"
import type { User, UserPayload } from "../../types/User";
//import { IoMdAdd } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  updateUser } from "../../services/serverService";
import { fetchUser } from "../../query/serverQueries";
import { BsDiscord } from "react-icons/bs";


const EditProfile = () => {

  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  const editProfileTabs = [
    {
      name: "Main Profile",
    },
    {
      name: "Per-server Profile"
    }
  ]

  const { 
    data: fetchedUserData 
  } = useQuery({
    ...fetchUser(user?.UserId || ""),
    enabled: !!user?.UserId
  })

  const [userDisplayValues, setUserDisplayValues] = useState<User>(
    {
      UserId: fetchedUserData?.data.UserId,
      username: fetchedUserData?.data.username,
      displayName: fetchedUserData?.data.displayName,
      email: fetchedUserData?.data.email,
      Firstname: "",
      Lastname: "",
      imgUrl: fetchedUserData?.data.imgUrl
    }
  )


  const [uploadedImage, setUploadedImage] = useState<File>()

  const [editPageActiveTab, setEditPageActiveTab] = useState<string>("Main Profile");

  const [hasChanges, setHasChanges] = useState<boolean>(false)

  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleInputRefClick = () => {
    if (!inputFileRef.current) return;
    inputFileRef.current.click();
  }

  const {
    mutateAsync: updateUserMutation,
    isPending
  } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async (userData: FormData) => await updateUser(
      userData, user?.UserId || ""
    ),

    onMutate: async (userInfo) => {
      await queryClient.cancelQueries({queryKey: ["user", user?.UserId]})

      const previousUserData = queryClient.getQueryData(["user", user?.UserId])

      if (!previousUserData) return;

      queryClient.setQueryData(["user", user?.UserId], (oldUserData: User) => {
        return{
          ...oldUserData,
          displayName: userInfo.get("Displayname"),
          userName: userInfo.get("userName"),
          email: userInfo.get("email"),
          imgUrl: userInfo.get("imgUrl")
        }
      })

      return { previousUserData }

    },

    onSuccess: () => {
      setHasChanges(false)
      setUploadedImage(undefined)
      
      console.log("Updated Information Successfully!")
      queryClient.invalidateQueries({queryKey: ["user", user?.UserId]})
    },
    onError: (err, _newFormData, context) => {
      console.log("An Error Occurred while updating profile.", err)

      if (context?.previousUserData){
        queryClient.setQueryData(["user", user?.UserId], context?.previousUserData)
      }
      
    }
  })

  const handleUpdateUser = async () => {
    console.log("Updating User...")

    if (!hasChanges) return;

    const userPayload: UserPayload = {
      UserId: userDisplayValues.UserId,
      displayName: userDisplayValues.displayName || "",
      username: userDisplayValues.username,
      userBio: userDisplayValues.bio || "",
      email: userDisplayValues.email || "",
      imgUrl: userDisplayValues.imgUrl || ""
    }

    const formData = new FormData();

    if (uploadedImage){
      formData.append("image", uploadedImage)
    }

    formData.append("userData", new Blob([JSON.stringify(userPayload)],
      {
        type: "application/json"
      }
    ))
    
    updateUserMutation(formData)
  }

  const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const files = e.target.files;

    // Safety check: Make sure array is populated
    if (!files || files.length === 0) {
        console.warn("No Files Detected!");
        return;
    }

    const file = files[0];

    // Type Check: images are only allowed
    if (!file.type.startsWith("image/")) {
        alert("Can only accept image type!");
        return;
    }

    // Size Check
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        alert("Masyadong mabigat 'to, pre! 5MB limit lang tayo.");
        return;
    }

    // Kung pasado lahat, gawa na ng ObjectURL
    const imageUrl = URL.createObjectURL(file);

    console.log("IMAGE DETECTED!!!")

    setUserDisplayValues((prev) => ({
      ...prev,
      imgUrl: imageUrl
    }))
    setUploadedImage(file)
  }

  // Sa loob ng useEffect (Optional pero malinis)
  useEffect(() => {
    return () => {
      if (userDisplayValues.imgUrl) {
        URL.revokeObjectURL(userDisplayValues.imgUrl);
      }
    };
  }, [userDisplayValues.imgUrl]);

  console.log(userDisplayValues)

  const MainProfileComponent = () => {
    return (
      <div className="">
        <div className="bg-yellow-100 h-25 rounded-lg px-2
          flex items-center justify-between w-full">

          <h1 className="text-gray-800 font-semibold">
            Give your profile a fresh look or else
          </h1>

          <button 
            type="button"
            className="self-center bg-gray-500 hover:bg-gray-400 duration-200 px-4 py-2 
            text-white cursor-pointer rounded-lg">
            Go To Shop
          </button>
        </div>


        <div className="flex mt-6">
          <div className="grow">
            <div className="mb-4 border-b border-gray-700 mr-5">
              <label className="font-semibold">
              Display Name
              </label>
              <input
                  type="text"
                  value={userDisplayValues.displayName || ""}
                  onChange={(e) => {
                    setHasChanges(user?.displayName !== e.target.value);
                    setUserDisplayValues(prev => ({
                      ...prev,
                      displayName: e.target.value
                    }))
                  }}
                    
                  className="bg-[#111113] focus:outline-[#7289DA] focus:outline-2
                text-[#ffffff] p-2 mb-7 mt-2 rounded-md block w-[85%]"
                />
            </div>
            
            <div className="mb-4 border-b border-gray-700 mr-5">
              <label className="font-semibold">
                Username
              </label>
              <input 
                  type="text"
                  value={userDisplayValues.username || ""} 
                  onChange={(e) => {
                    setHasChanges(user?.username !== e.target.value);
                    setUserDisplayValues((prev) => ({
                      ...prev,
                      username: e.target.value
                    })
                  )}}
                  className="bg-[#111113] focus:outline-[#7289DA] focus:outline-2 
                text-[#ffffff] p-2 mb-7 mt-2 rounded-md block w-[85%]"
                />
            </div>
            
            <div className="mb-4 border-b border-gray-700 mr-5">
              <label className="font-semibold">
                Email Address
              </label>
              <input 
                  type="text"
                  value={userDisplayValues.email || ""}
                  onChange={(e) => {
                      setHasChanges(user?.email !== e.target.value);
                      setUserDisplayValues((prev) => ({
                      ...prev,
                      email: e.target.value
                    })
                  )}} 
                  className="bg-[#111113] focus:outline-[#7289DA] focus:outline-2 
                text-[#ffffff] p-2 mb-7 mt-2 rounded-md block w-[85%]"
                />
            </div>

            <div className="mb-4 pb-5 border-b border-gray-700 mr-5">
              <h1 className="font-semibold my-1">Bio</h1>
              <p className="font-light pb-2 text-gray-400">Just be yourself n****</p>
              <textarea 
                name="" 
                id=""
                cols={50}
                rows={6}
                value={fetchedUserData?.data.userBio || ""}
                className="bg-[#111113] focus:outline-[#7289DA] focus:outline-2 
                text-[#ffffff] "></textarea>
            </div>
            
          </div>

          <div className="bg-[#232428] h-100 grow rounded-xl">
            
            {/* Banner img container */}
            <div className="h-25 bg-red-400 w-full rounded-t-lg"></div>

            {/* Avatar img container */}
            <div className="pl-4 bg-[#232428]">

              <div className="relative pb-15">
                {/*ACTUAL PREVIEW */}
                {
                  fetchedUserData?.data.imgUrl || uploadedImage
                  ? <img 
                      src={userDisplayValues.imgUrl || 
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                      } 
                      alt="Preview"
                      className="h-24 w-24 rounded-full absolute 
                      -top-10 border-6 border-[#232428] bg-gray-600 object-cover"
                    />
                  : <BsDiscord className="bg-indigo-500 h-24 w-24  rounded-full p-4
                      absolute -top-10 border-6 border-[#232428]  object-cover"/>
                }
                

                {/* 2. ANG INPUT FILE (Naka-tago dapat 'to) */}
                <input 
                  type="file"
                  ref={inputFileRef}
                  onChange={(e) => {
                    setHasChanges(true)
                    handleImageInput(e)
                  }}
                  accept="image/*"
                  className="hidden" 
                />

                {/* 3. ANG OVERLAY (Hover effect / Pencil icon) */}
                <div 
                  className="opacity-0 hover:opacity-100 bg-black/40 h-24 w-24 rounded-full 
                  absolute -top-10 z-40 cursor-pointer flex items-center justify-center"
                  onClick={handleInputRefClick} // Ito ang magti-trigger sa hidden input
                  >
                  <FaPencilAlt className="text-white text-xl" />
                  
                  {/* Tooltip / "Change Avatar" Label */}
                  <div className="hidden hover:block absolute top-0 left-26 w-32 bg-[#111113] rounded-md p-2 shadow-xl">
                    <span className="text-sm font-semibold text-white">Change Avatar</span>
                  </div>
                </div>
              </div>
              

              <p className="text-xl font-bold">
                <input 
                  type="text" 
                  readOnly
                  className="bg-transparent pointer-events-none"
                  value={userDisplayValues.displayName}
                  />
              </p>

              <p className="text-sm font-light">
                <input 
                  type="text" 
                  readOnly
                  className="bg-transparent pointer-events-none"
                  value={userDisplayValues.username}
                  />
              </p>
              
            </div>

          </div>
        </div>
      </div>
    )
  }

  const PerServerProfile = () => {
    return (
      <div>
        Per Server Profile Here...
      </div>
    )
  }
  return (
    <div className="grid grid-cols-7">
      
      <div className=" col-start-2 col-end-7">
        
        <div className="flex gap-7 cursor-pointer mx-1">
          {editProfileTabs.map((tab, i) => (
            <div key={i} 

              className={`${editPageActiveTab === tab.name 
                ? `text-[#7289DA] underline decoration-[#7289DA] 
                underline-offset-17 decoration-3` 
                : ""
              }`}
              onClick={() => setEditPageActiveTab(tab.name)}
              >
              {tab.name}
            </div>
          ))}
        </div>
        
        <hr className="my-3 mx-1"/>
        
        <div className="mx-1">
          {editPageActiveTab === "Main Profile" && MainProfileComponent()}
          {editPageActiveTab === "Per-server Profile" && PerServerProfile()}
        </div>
        
        {
          hasChanges && 
          <div className="fixed bottom-20 w-190 p-3 
          bg-[#36363a] shadow-2xl rounded-lg 
          font-semibold animate-alarm [animation-iteration-count:6]
          flex justify-between items-center">
            Careful -- you have unsaved changes!

            <div>
              <button 
                disabled={isPending}
                type="button"
                className="text-[#7289DA] hover:underline 
                cursor-pointer mx-6 disabled:text-[#0c132c]"
                onClick={() => {
                  setHasChanges(false)
                  setUserDisplayValues(fetchedUserData?.data)
                  }
                } 
                >
                  Reset
              </button>

              <button
                disabled={isPending}
                className="bg-green-600 rounded-lg p-1 px-2
                hover:bg-green-700 duration-100 cursor-pointer
                disabled:bg-green-900
                "
                onClick={handleUpdateUser}
              >
                Save Changes
              </button>
            </div>
          </div>
        }
      </div>

      

    </div>
  )
}

export default EditProfile