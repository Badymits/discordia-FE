import { type ChangeEvent, createRef, useRef, useState  } from 'react'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchServer } from "../../query/serverQueries"
import { useParams } from "react-router-dom"


import Cropper, { type ReactCropperElement } from "react-cropper"; 
import 'cropperjs/dist/cropper.css';

import { IoClose } from "react-icons/io5";
import { updateServer } from '../../services/serverService'
import type { Server } from '../../types/ServerTypes'
import { FaPencilAlt } from 'react-icons/fa'
import { CiImageOn } from "react-icons/ci";
import { RxRotateCounterClockwise } from "react-icons/rx";
import { Tooltip } from 'react-tooltip'

interface UpdateServerPayload {
  serverData: FormData;
  serverId: string;
}

const ServerProfile = () => {

  const queryClient = useQueryClient();
  const { serverId } = useParams();

  const {
    data: serverData
  } = useQuery({
    ...fetchServer(serverId || ""),
    enabled: !!serverId,
    staleTime: 1000 * 5 * 60,
    gcTime: 1000 * 30 * 60
  })

  const [openImageEditModal, setOpenImageEditModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  // string URLs that will be used for src attribute in img HTML tags
  const [imageCrop, setImageCrop] = useState<string>() // image to edit
  const [imagePreview, setImagePreview] = useState<string>() // final output
  
  const [value, setValue] = useState<number>(0.1)
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [textDescription, setTextDescription] = useState<string>("")
  
  // File will be used to send to BE
  const [serverIcon, setServerIcon] = useState<File>()

  const cropperRef = createRef<ReactCropperElement>();
  const serverNameInputRef = useRef<HTMLInputElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const rangeRef = useRef<HTMLInputElement>(null)

  const {
    mutateAsync: updateServerMutation,
    isPending,
    reset
  } = useMutation({
    mutationKey: ["updateServer"],
    mutationFn: async ({serverData, serverId}: UpdateServerPayload) => 
      await updateServer(serverData, serverId || ""),

    onMutate: async (serverFormData) => {
      await queryClient.cancelQueries({queryKey: ["serverChannels", serverId]})

      const server = queryClient.getQueryData(["serverChannels", serverId])
      const serverName = serverFormData.serverData.get("serverName")
      const serverDescription = serverFormData.serverData.get("serverDescription")
      const imageFile = serverFormData.serverData.get("serverIcon")

      let fileUrl = ""

      if (imageFile instanceof File) {
        fileUrl = URL.createObjectURL(imageFile);
      }

      if (!server) return 

      queryClient.setQueryData(["serverChannels", serverId], (oldServer: Server) => {
        
        if (!oldServer) return ;
        console.log("servers: ", oldServer)

        return {
          ...oldServer,
          serverName: serverName,
          serverDescription: serverDescription,
          serverIcon: fileUrl
        }
      })

      return {server, fileUrl}
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["serverChannels", serverId], context?.server)
    },

    onSuccess: (response, _variables, context)  => {

      // may just return a string
      console.log(response.data)

      setTextDescription("")
      setServerIcon(undefined)
      setImageCrop("")
      setHasChanges(false)

      if (imagePreview){
        URL.revokeObjectURL(imagePreview)
      }
    
      // remove from browser storage to prevent memory leak 
      if (context?.fileUrl) {
        URL.revokeObjectURL(context.fileUrl);
      }

      queryClient.invalidateQueries({queryKey: ["serverChannels", serverId]})
      reset();
    },
  })

  const getInitials = (serverName: string) => {
    return serverName
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }


  const handleInputRefClick = () => {
    if (!inputFileRef.current) return;
    inputFileRef.current.click();
  }

  // cleanup to prevent memory leaks
  const onModalClose = () => {
    if (!imageCrop) return;

    if (imagePreview){
      URL.revokeObjectURL(imagePreview)
    }

    URL.revokeObjectURL(imageCrop)
    
    setImageCrop("")
    setHasChanges(false)
    setOpenImageEditModal(false)
    return;
  }

  // set image to be cropped
  const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    if (imagePreview){
      URL.revokeObjectURL(imagePreview)
    }

    const files = e.target.files
  
    if (!files || files.length === 0){
      return
    }

    const file = files[0]

    if (!file.type.startsWith("image/")){
      console.log("Cannot upload any other file aside from image")
      return;
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize){
      console.log("File too large, can only accept 5MB size")
      return;
    }

    const imgUrl = URL.createObjectURL(file)

    setImageCrop(imgUrl)
    setOpenImageEditModal(true)
    
    return;
  }

  // previews image and will be used to send to BE
  const handleConfirmCrop = () => {

    if (!imageCrop || !serverId || !cropperRef) {
      return;
    }
    
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setIsLoading(true)
      const cropper = cropperRef?.current.cropper

      if (!cropper) return;

      const canvas = cropper.getCroppedCanvas({
        width: 512,
        height: 512
      })


      canvas.toBlob((blob) => {
        if (!blob) return;

        const safeBlob = blob as Blob

        const imgUrl = URL.createObjectURL(safeBlob)
        setImagePreview(imgUrl)

        const file = new File([safeBlob], "server-icon.png", {
          type: "image/png"
        })

        setServerIcon(file)
        setImageCrop(undefined)
        setOpenImageEditModal(false)

        if (imageCrop){
          URL.revokeObjectURL(imageCrop)
        }
        setIsLoading(false)
      }, "image/png")
      return;
    }
    
  };

  const handleUpdateServer = () => {
    console.log(serverNameInputRef.current?.value)

    if (!serverId) return;

    const serverData = new FormData()

    if (serverIcon){
      serverData.append("image", serverIcon)
    }

    const serverDataPayload = {
      serverName: serverNameInputRef.current?.value,
      serverDescription: textDescription,
    }

    serverData.append("serverData", new Blob([JSON.stringify(serverDataPayload)],
      {
        type: "application/json"
      }
    ))

    updateServerMutation({serverData, serverId})
  }
  console.log(imageCrop)
  console.log(imagePreview)
  console.log(serverIcon)

  return (
    <div className="grid grid-cols-7 mt-8 relative">
      
      <div className="col-span-4 mr-2">
        <p className="text-xl font-bold">Server Profile</p>
        <p className="">Customize how your server appears in server invite links and, if enabled, in Server Discovery
          and Announcement Channel Messages
        </p>

        {/* Server name input */}
        <div className="mt-12 font-normal">
          Server Name
          <input 
            type="text"
            ref={serverNameInputRef}
            defaultValue={serverData?.serverName}
            onChange={() => setHasChanges(true)}
            className="bg-[#19191b] focus:outline-[#4567df] focus:outline-2 border-[#393d41] 
              text-[#ffffff] p-2 rounded-md cursor-pointer block w-full mt-1"
           />

           <hr className="mt-15 border border-[#393d41] "/>
        </div>

        
        {/* Server Icon input */}
        <div className="mt-8 font-semibold">
          <p className="">Icon</p>
          <p className="font-thin text-gray-400">We recommend using an image....</p>
          <button 
            type="button"
            className="bg-[#4567df] hover:bg-[#4e69ca] duration-100 p-1 rounded-md 
            mt-2 text-sm cursor-pointer"
            onClick={() => handleInputRefClick()}
            >
              Change Server Icon
          </button>
          <hr className="mt-10 border border-[#393d41] "/>
        </div>

        <input 
          type="file" 
          accept="image/*"
          className="hidden"
          ref={inputFileRef}
          onChange={(e) => handleImageInput(e)}
        />

        {/* Server Description input */}
        <div className='mt-8 font-semibold'>
          <p>Description</p>
          <p className='font-thin text-gray-400'>
            How did your server get started? Why should people join?
          </p>

          <textarea 
            className='bg-[#19191b] focus:outline-[#4567df] 
            focus:outline-2 w-full mt-2 resize-none rounded-md border placeholder:font-thin
            p-2 border-[#393d41]'
            placeholder='Tell the world a bit about your server'
            name="" 
            id="" 
            cols={50} 
            rows={3}></textarea>
        </div>
      </div>

      {/* Server Profile Preview */}
      <div className="bg-[#232428] h-65 w-70 rounded-lg mx-5 shadow-md">

        {/* Banner img container */}
        <div className="h-25 bg-red-400 w-full rounded-t-lg"></div>

        {/* Avatar img container */}
        <div className="pl-4 ">

          <div className="relative pb-15">
            {/*ACTUAL PREVIEW */}
            {
              serverData?.serverIcon || imagePreview
              ? <img 
                  src={serverData?.serverIcon 
                    ? serverData?.serverIcon
                    : imagePreview
                  } 
                  alt="Preview"
                  className="h-20 w-20 rounded-md absolute 
                  -top-10 border-6 border-[#232428] bg-gray-600 object-cover"
                />
              : 
              <div className='h-20 w-20 rounded-md bg-gray-700 absolute -top-10 
              flex items-center justify-center border-4 border-[#1a1c1d]'>
                {getInitials(serverData?.serverName)}
              </div>
            }
            

            {/* 2. ANG INPUT FILE (Naka-tago dapat 'to) */}
            <input 
              type="file"
              ref={inputFileRef}
              onChange={(e) => {
                // setHasChanges(true)
                handleImageInput(e)
              }}
              accept="image/*"
              className="hidden" 
            />

            {/* 3. ANG OVERLAY (Hover effect / Pencil icon) */}
            <div 
              className="opacity-0 hover:opacity-100 bg-black/40 h-18 w-18 rounded-md 
              absolute -top-9 left-1  z-40 cursor-pointer flex items-center justify-center"
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
              value={serverData?.serverName}
              />
          </p>
        </div>
      </div>

      {
        imageCrop && openImageEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#2B2D31] text-white rounded-lg p-6 w-130 ">
                {/* Content here */}

                <div className="w-full flex items-center justify-between text-xl">
                  <p className='font-semibold'>Edit Image</p>
                  <IoClose className="text-2xl cursor-pointer hover:bg-white/10 duration-100 rounded-md"
                    onClick={() => {
                      onModalClose()
                      setOpenImageEditModal(false)
                    }}
                  />
                </div>
                
                <div className="relative h-130">
                    
                  <Cropper 
                    src={imageCrop} 
                    ref={cropperRef}
                    className='h-110 w-full mt-10'
                    initialAspectRatio={1}
                    background={false}
                    zoomOnWheel={false}
                    ready={() => {
                      // Dito mo tawagin ang zoom pag selyadong "ready" na ang width/height
                      const cropper = cropperRef.current?.cropper;
                      if (cropper) {
                        cropper.zoomTo(0.5); 
                      }
                    }}
                    zoom={(e) => {
                      // When scrolling with mouse, it updates the slider (range input) simultaneously
                      setValue(e.detail.ratio); 
                    }}
                    autoCropArea={1} // crop area immediately expands up to boundary, capturing whole image
                    aspectRatio={1}
                    viewMode={1} // adds a boundary, crop area will not go beyond image
                    checkOrientation={true}
                    guides={false} // false = removes grid lines of crop
                    center={false} // removes crosshair
                    highlight={false} // no white overlay
                    dragMode='move' // holding left click adjusts image, not using cursor to move image/crop area
                  />
                    
                  <div className='absolute bottom-8 left-1/2 -translate-x-1/2 
                   w-full'>

                    <div className='flex items-center justify-center gap-2 mr-2'>
                      <CiImageOn className='text-base font-bold'/>
                      <input
                        type="range"
                        min={0.1}
                        max={3}
                        step={0.01}
                        value={value}
                        ref={rangeRef}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setValue(val); // I-update ang state
                          cropperRef.current?.cropper.zoomTo(val);
                        }}
                        style={{ width: '150px' }}
                        className='
                          accent-indigo-500 h-0.75 cursor-pointer
                        '
                      />
                      <CiImageOn className='text-2xl'/>
                    </div>
                    

                    <RxRotateCounterClockwise className='text-xl absolute 
                      right-1 top-px cursor-pointer duration-100'
                      data-tooltip-content="Rotate"
                      data-tooltip-id="Rotate"

                      onClick={() => 
                        cropperRef.current?.cropper.rotate(90)
                      }
                    />
                  </div>
                  
                  <Tooltip id='Rotate' place='top' className='z-50'/>
                </div>
                  {/* Edit Image options */}
                <div className='w-full flex items-center justify-between'>
                  
                  <button
                    type='button'
                    onClick={() => {
                      const cropper = cropperRef.current?.cropper

                      if (cropper) {
                        cropper.reset()
                        setValue(cropper.getData().scaleX || 0.1)
                      }
                      
                    }}
                    className='text-indigo-500 hover:underline text-xl cursor-pointer
                      disabled:text-indigo-800 disabled:pointer-events-none
                      font-semibold 
                    '
                    disabled={value === 0.1 || isLoading}
                  >
                    Reset
                  </button>


                  <div className='font-semibold'>

                    <button 
                      onClick={() => {
                        onModalClose()
                        setHasChanges(false)
                        setOpenImageEditModal(false)
                      }}
                      className='bg-[#363c41] py-2 px-4 rounded-md mx-2
                        disabled:bg-[#1a1b1d] disabled:text-gray-700
                      '
                      disabled={isLoading}
                      >
                      
                      Cancel
                    </button>

                    <button 
                      type='button'
                      onClick={() => {
                        setHasChanges(true)
                        handleConfirmCrop()
                      }}
                      className='bg-indigo-500 py-2 px-4 rounded-md mx-2'>
                      Apply
                    </button>
                  </div>

                </div>
            </div>
          </div>
        )
      }

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
              onClick={handleUpdateServer}
            >
              Save Changes
            </button>
          </div>
        </div>
      }

    </div>
  )
}

export default ServerProfile