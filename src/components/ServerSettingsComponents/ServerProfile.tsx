import { type ChangeEvent } from 'react'

import { useQuery } from "@tanstack/react-query"
import { fetchServer } from "../../query/serverQueries"
import { useParams } from "react-router-dom"

import Cropper, { type Area } from "react-easy-crop"
import { useRef, useState } from "react"


import { IoClose } from "react-icons/io5";


const ServerProfile = () => {

  const { serverId } = useParams();

  const {
    data: serverData
  } = useQuery({
    ...fetchServer(serverId || ""),
    enabled: !!serverId,
    staleTime: 1000 * 5 * 60,
    gcTime: 1000 * 30 * 60
  })

  //for image crop
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const [openImageEditModal, setOpenImageEditModal] = useState<boolean>(false)
  const [imageCrop, setImageCrop] = useState<string>()
  const [value, setValue] = useState(zoom)

  const serverNameInputRef = useRef<HTMLInputElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleRangeChange = (e) => {
    const newValue = Number(e.target.value)
    setValue(newValue)
    setZoom(newValue)
  }

  const onCropComplete = (croppedArea, croppedAreaPixels: Area) => {
    console.log(croppedAreaPixels.width / croppedAreaPixels.height)
  } 

  const handleInputRefClick = () => {
    if (!inputFileRef.current) return;
    inputFileRef.current.click();
  }

  const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

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

  const onModalClose = () => {
    if (!imageCrop) return;

    URL.revokeObjectURL(imageCrop)
    setImageCrop("")
    return;
  }

  const handleSubmit = () => {
    console.log(serverNameInputRef.current?.value)
  }



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
      <div className="bg-[#2c2f33] h-65 w-70 rounded-lg mx-5 shadow-md">

      </div>

      {
        imageCrop && openImageEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#2B2D31] text-white rounded-lg p-6 w-200 ">
                {/* Content here */}

                <div className="w-full flex items-center justify-between text-xl">
                  <p>Edit Image</p>
                  <IoClose className="text-2xl cursor-pointer hover:bg-white/10 duration-100 rounded-md"
                    onClick={() => {
                      onModalClose()
                      setOpenImageEditModal(false)
                    }}
                  />
                </div>
                
                <div className="relative h-200">
                  <Cropper 
                    image={serverData?.serverIcon 
                      ? serverData?.serverIcon
                      : imageCrop
                    }
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape='rect'
                    showGrid={false}
                    onCropChange={(crop) => setCrop(crop)}
                    onZoomChange={(zoom) => setZoom(zoom)}
                    onCropComplete={onCropComplete}
                    classes={{
                      containerClassName:"h-120 w-100 mt-20 w-full",
                      cropAreaClassName:"rounded-md"
                    }}
                  />

                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={value}
                    onChange={handleRangeChange}
                    style={{ width: '200px' }}
                  />
                </div>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default ServerProfile