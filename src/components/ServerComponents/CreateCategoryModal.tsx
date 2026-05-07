
import { motion,AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CgClose } from "react-icons/cg"
import { RiLockFill, RiShieldUserFill } from "react-icons/ri";
import { useCurrentUser } from "../../context/UserContext";
import type { Category, CreateCategoryPayload } from "../../types/ServerTypes";
import { createCategory } from "../../services/serverService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface CreateCategoryProps{
  closeModal: () => void,
}


const CreateCategoryModal = ({
  closeModal,
}: CreateCategoryProps) => {

  const { user } = useCurrentUser()
  const { serverId } = useParams();

  const queryClient = useQueryClient();

  const [roleAccess, setRoleAccess] = useState<string>("")
  
  // dynamic display of text for sub headers and input value
  const [categoryName, setCategoryName] = useState<string>("")

  const [createCategoryStep, setCreateCategoryStep] = useState<number>(1)
  const [isCategoryPrivate, setIsCategoryPrivate] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [serverMembers, setServerMembers] = useState([])

  const {
    mutateAsync: createCategoryMutation,
    isPending,
    //isError
  } = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: async (payload: CreateCategoryPayload) => 
      await createCategory(payload),

    onMutate: async(createdCategory) => {

      console.log("Category in progress: ", createCategory)
      await queryClient.cancelQueries({queryKey: ["serverChannels", serverId]})

      const categoryForChannels = queryClient.getQueryData(["serverChannels", serverId])

      if (!categoryForChannels){
        return;
      }

      queryClient.setQueryData(["serverChannels", serverId], (channel: Category) => [
        channel,
        {
          categoryName: createdCategory.categoryName,
        }
      ])

      return { categoryForChannels }
    },

    onError: (context) => {
      queryClient.setQueryData(["serverChannels", serverId], context.message)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["serverChannels"]})
      closeModal()
    }
  })

  const handleCreateCategory = async() => {
    console.log("Creating Category...")


    const payload: CreateCategoryPayload = {
      serverId: serverId || "",
      categoryName: categoryName
    }

    createCategoryMutation(payload)
  }

  const formatCategoryName = (name: string) => {
    const format =  name.toLowerCase().replace(/\s+/g, '-')
    setCategoryName(format)
  }

  const createCategoryContent = () => {
    return (
      <div>

        {/* Modal Header */}
        <div className='text-left p-4'>
          <div className="my-1">
            <p className="text-2xl font-bold">Create Category</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="mt-2 p-4">
          <p>Category Name</p>
          <input 
            placeholder={`new-category`}
            value={categoryName}
            onChange={(e) => formatCategoryName(e.target.value)}
            className='bg-[#111113] outline-[#7289DA] focus:outline-2 
            text-gray-400 p-2 mt-2 rounded-md cursor-pointer w-full'
          />

          <div className='flex items-center justify-between mt-6'>
            <div className=''>
              <RiLockFill className='inline-block text-xl pb-1'/> Private Category
              <p className='text-gray-400 text-sm w-90'>
                By making a category private, only select members and roles will be able
                to view this category. Linked Channels in this category will automatically
                match this setting
              </p>
            </div>
            
            
            {/* Toggle Element */}
            <div 
              className={`relative w-14 h-6.5 rounded-xl 
                cursor-pointer border border-[#363c41] 
                ${isCategoryPrivate ? "bg-[#7289DA]" : "bg-[#232428]"}
                `}
              onClick={() => setIsCategoryPrivate(!isCategoryPrivate)}
              >
              <span 
                className={`absolute top-1 h-4 w-4 rounded-full bg-white
                  duration-400 transition-all ease-in-out 
                  ${isCategoryPrivate 
                    ? "translate-x-8.25 " 
                    : "translate-x-0.75"
                  }`}>
              </span>
            </div>
          </div>
        </div>
        
        {/* Modal Footer btn row*/}
        <div className="flex justify-between items-center gap-2 mt-4 p-4">
          <button
            type="button"
            className="w-full bg-[#232428] p-2 rounded-md my-2 
            cursor-pointer hover:bg-white/10 durattion-200"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button type="button" 
            disabled={categoryName.length < 1 || isPending}
            className="w-full font-semibold cursor-pointer duration-100
              bg-[#607de4] hover:bg-[#7289DA] p-2 rounded-md 
              disabled:opacity-60 disabled:pointer-events-none"
            onClick={() => (
              isCategoryPrivate 
                ? setCreateCategoryStep(createCategoryStep + 1)
                : handleCreateCategory()
            )}  
            >
            {
              isCategoryPrivate ? "Next" : "Create Category" 
            }
          </button>
        </div>
      </div>
    )
  }

  const secondPage = () => {
    return (
      <div className=''>
        {/* Modal Header */}
        <div className='text-left p-4'>
          <div className="my-3">
            <p className="text-2xl font-bold">Add members or roles</p>
            <p className='text-gray-400'>
              {categoryName}
            </p>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className=' px-4 flex-1 overflow-y-auto pb-2 h-140'>
          <input 
            placeholder={`e.g Moderators, @wumpus`}
            value={roleAccess}
            onChange={(e) => setRoleAccess(e.target.value)}
            className='bg-[#111113] outline-[#7289DA] focus:outline-2 
            text-gray-400 pl-2 p-2 rounded-md cursor-pointer w-full'
          />
          <p className='mt-2 text-sm'>
            Add individual members by starting with @ or type a role name
          </p>

          <div className='mt-7'>
            <p className='font-bold'>Roles</p>

            <div className={`p-2.5 rounded-md hover:bg-white/10
              ${serverMembers.length > 1 ? "" : "opacity-50"}`}>
              <input 
                type="checkbox" 
                checked={serverMembers.length < 1 ? true : false}
                onChange={() => {}}
                className='bg-[#232428] mr-3 peer h-5 w-5 appearance-none 
                  rounded-sm border border-slate-300 cursor-pointer duration-200
                  checked:bg-[#7289DA]  align-middle'
              />

              {/* Should only show if there are no created roles in the server */}
              <p className='inline-block align-middle'>
                <RiShieldUserFill className='inline-block mr-1'/>
                {
                  serverMembers.length > 1
                  ? ""
                  : "You haven't created any roles yet"
                }
              </p>
            </div>

          </div>

          <div className='mt-5 '>
            <p className='font-bold mb-2'>Members</p>
            
            <div className='p-2.5 rounded-md hover:bg-white/10 
              flex items-center '>
              <input 
                type="checkbox" 
                onChange={() => {}}
                className='bg-[#232428] mr-2 peer h-5 w-5 appearance-none 
                  rounded-sm border border-slate-300 cursor-pointer duration-200
                  checked:bg-[#7289DA] align-middle'
              />
              
              {/* Map server members here... */}
              <div className='flex items-center p-1'>
                <div className='mr-2'>
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" 
                    alt={user?.userName}
                    className='h-6 w-6 rounded-full bg-gray-100 ' 
                  />
                </div>
                {
                  serverMembers.length > 1
                  ? "Members here..."
                  : (
                    <div>
                      {user?.Firstname} 
                      <span className='font-thin text-gray-400 ml-2'>
                        {user?.userName}
                      </span>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>

        {/* Modal Page Footer */}
        <div className='mb-auto border-t border-[#363c41] px-3 pb-5'>
          <div className="flex justify-between items-center gap-2 mt-4">
            <button
              type="button"
              className="w-full bg-[#232428] p-2 rounded-md my-2 
              cursor-pointer hover:bg-white/10 durattion-200"
              onClick={() => 
                setCreateCategoryStep(createCategoryStep - 1)
              }
            >
              Back
            </button>

            <button type="button" 
              disabled={categoryName.length < 1}
              className="w-full font-semibold cursor-pointer duration-100
                bg-[#607de4] hover:bg-[#7289DA] p-2 rounded-md 
                disabled:opacity-60 disabled:pointer-events-none"
              onClick={() => handleCreateCategory()}  
              >
              Skip
            </button>
          </div>
        </div>

      </div>
    )
  }

  return (
    <div>
      <motion.div className="flex flex-col w-120 bg-[#2B2D31] 
      text-white shadow-2xl rounded-xl relative cursor-default duration-100"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}  
        >
        <CgClose 
          onClick={closeModal} 
          className="text-2xl absolute right-3 top-4 cursor-pointer"
        />
        <AnimatePresence mode="wait">
          <motion.div
              key={createCategoryStep} // Mahalaga 'to para malaman ni Framer na nagbago ang content
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
          >
              {/* {createChannelStep === 1 && firstPage()}
              {createChannelStep === 2 && secondPage()} */}
              {createCategoryStep === 1 && createCategoryContent()}
              {createCategoryStep === 2 && secondPage()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default CreateCategoryModal