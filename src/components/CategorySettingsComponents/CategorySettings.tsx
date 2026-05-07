import { IoIosCloseCircleOutline } from "react-icons/io"
import { CategorySettingsOptions } from "../../utils/PanelSettings";
import { useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaFolder } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory, updateCategory } from "../../services/serverService";
import { useParams } from "react-router-dom";
import type { Server } from "../../types/ServerTypes";


interface MasterSettingsProps {
  closeModal: () => void;
  categoryName: string;
  categoryId: string;
}

const MasterSettingsLayout = ({
  closeModal,
  categoryName,
  categoryId,
}: MasterSettingsProps) => {

  const queryClient = useQueryClient();
  const { serverId } = useParams();

  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(false);
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState(101)

  const categoryNameRef = useRef<HTMLInputElement>(null);

  const {
    mutate: updateCategoryMutate,
    isPending
  } = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: async (categoryName: string) => await updateCategory(categoryName, categoryId),
    onMutate: async(categoryData) => {

      await queryClient.cancelQueries({queryKey: ["serverChannels", serverId]})

      const categoryList = queryClient.getQueryData(["serverChannels", serverId])

      if (categoryList){
        await queryClient.setQueryData(["serverChannels", serverId], (serverChannelsList: Server) => {
        
          if (serverChannelsList.serverCategories?.length === 0){
            return serverChannelsList
          }

          const serverCategories = serverChannelsList.serverCategories

          const updatedCategory =  serverCategories?.map((cat) => (
            cat.categoryId === categoryId
            ? { ...cat, categoryName: categoryData }
            : cat
          ))

          return {...serverChannelsList, serverCategories: updatedCategory }
        })
      }

    
      return { categoryList }

    },
    onError(error, _variables, context) {
      console.error(error)
      queryClient.setQueryData(["serverChannels", serverId], context?.categoryList)
    },
    onSuccess: (data) => {
      console.log(data)

      queryClient.invalidateQueries({queryKey: ["serverChannels", serverId]})
      setHasChanges(false)

    },
  })

  const {
    mutate: deleteCategoryMutation,
  } = useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: async (categoryId: string) => await deleteCategory(categoryId),
    
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey: ["serverChannels", serverId]})


      const serverChannelsList = queryClient.getQueryData(["serverChannels", serverId])

      if (serverChannelsList){
        await queryClient.setQueryData(["serverChannels", serverId], (channelList: Server) => {

          const categoryList = channelList.serverCategories

          if (!categoryList) return channelList
          if(!channelList) return [];

          
          const updatedCategoryList = categoryList?.filter((cat) => cat.categoryId !== categoryId)

          return { ...channelList, serverCategories: updatedCategoryList }
        })
      } 
      return {serverChannelsList}
    },
    onError: (error, _variables, context) => {
      console.error(error)
      queryClient.setQueryData(["serverChannels", serverId], context?.serverChannelsList)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["serverChannels", serverId]})
      setHasChanges(false)
      closeModal()
    }
  })

  const handleUpdateCategory = () => {
    if (!categoryId || !serverId){
      console.error("Cannot update category without ID")
      return;
    }

    if (!categoryNameRef.current){
      console.log("Category Name ref not found")
      return;
    }
    
  
    updateCategoryMutate(categoryNameRef.current?.value || "")
  }

  const handleDeleteCategory = () => {
    if (!categoryId){
      console.log("Category ID does not exist!")
      return;
    }

    deleteCategoryMutation(categoryId)
    setConfirmDeleteCategory(false)
  }


  return (
    <div className="h-screen w-full overflow-hidden bg-[#23272a]
      grid grid-cols-24 font-thin relative">

       <div className="absolute right-3 top-3 text-[#c6ccd3] flex flex-col items-center">
          <IoIosCloseCircleOutline onClick={closeModal} className="text-5xl "/>
          <p>ESC</p>
        </div>

        <div className="col-span-9 bg-[#111113] pr-5 text-[#c6ccd3]">
          <div className="self-center justify-self-end w-60 mt-15 h-full overflow-auto font-semibold">

            <p className="text-gray-500">
              <FaFolder className="inline-block mx-2 my-1"/>
              {categoryName}
            </p>

            {CategorySettingsOptions.map((cat) => (
              <div
                key={cat.id}
                className={`py-1 cursor-pointer px-2 rounded-md hover:bg-white/10 my-1
                  ${activeTab === cat.id ? "bg-white/20 text-gray-300" : "text-gray-400"}
                  `}
                onClick={() => {
                  if (cat.id === 103) setConfirmDeleteCategory(true)
                  setActiveTab(cat.id)
                }}
              >
                <hr className={`${cat.id === 103 ? "border-b border-[#363c41]" : "border-0"}`}/>

                <p className={`${cat.id === 103 && "text-red-400"} `}>
                  {cat.name}
                </p>
                
              </div>
            ))}
          </div>
        </div>

        <div className="mt-15 w-full col-span-9 mx-5 text-white">
            <p className="font-semibold mb-2">Overview</p>

            <div>
              <p>Category Name</p>
              <input 
                type="text" 
                ref={categoryNameRef}
                defaultValue={categoryName}
                onChange={() => setHasChanges(true)}
                className="bg-[#111113] focus:outline-indigo-500 focus:outline-2
                text-[#ffffff] p-2 mb-7 mt-2 rounded-md block w-[85%]" />
            </div>
        </div>

        {
          confirmDeleteCategory && (
            <div
              className="fixed inset-0 h-screen w-full bg-black/10
                flex items-center justify-center
              "
            > 
              <div className="bg-[#2B2D31] w-100 text-white p-3 font-semibold rounded-md">

                <div className="flex items-center justify-between py-2">
                  <p>Delete Category</p>
                  <CgClose 
                    className="text-2xl cursor-pointer"
                    onClick={() => setConfirmDeleteCategory(false)}
                  />
                </div>

                <div className="font-light py-3">
                  Are you sure you want to delete <span className="font-bold">{categoryName}</span>?
                  This cannot be undone
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button type="button" className="bg-[#36363a] p-2 rounded-md cursor-pointer w-full"
                    onClick={() => setConfirmDeleteCategory(false)}
                  >
                    Cancel
                  </button>

                  <button type="button" className="bg-red-500 p-2 rounded-md w-full 
                  hover:bg-red-400 cursor-pointer duration-200"
                    onClick={() => handleDeleteCategory()}
                  >
                    Delete Category
                  </button>
                </div>
                
              </div>
            </div>
          )
        }

        {
          hasChanges && 
          <div className="fixed bottom-20 w-190 p-3 
          bg-[#36363a] shadow-2xl rounded-lg left-1/2 translate-y-1/2
          font-semibold animate-alarm [animation-iteration-count:6]
          flex justify-between items-center text-white">
            Careful -- you have unsaved changes!

            <div>
              <button 
                disabled={isPending}
                type="button"
                className="text-[#7289DA] hover:underline 
                cursor-pointer mx-6 disabled:text-[#0c132c]"
                onClick={() => {
                  setHasChanges(false)

                  if (categoryNameRef.current){
                    categoryNameRef.current.value = categoryName
                  }
                }} 
                >
                  Reset
              </button>

              <button
                disabled={isPending}
                className="bg-green-600 rounded-lg p-1 px-2
                hover:bg-green-700 duration-100 cursor-pointer
                disabled:bg-green-900
                "
                onClick={handleUpdateCategory}
              >
                Save Changes
              </button>
            </div>
          </div>
        }

    </div>
  )
}

export default MasterSettingsLayout