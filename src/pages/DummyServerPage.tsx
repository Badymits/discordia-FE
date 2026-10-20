import { serverChannelExample } from "../utils/DummyData"
import { memo, useCallback, useRef, useState, type PropsWithChildren } from "react"
import type { Category, Channel } from "../types/ServerTypes";


import {useSortable} from '@dnd-kit/react/sortable';
import {DragDropProvider, DragOverlay, useDragOperation} from '@dnd-kit/react';
import type {DragDropEventHandlers} from '@dnd-kit/react'
import {RestrictToElement} from '@dnd-kit/dom/modifiers';
import {RestrictToVerticalAxis} from '@dnd-kit/abstract/modifiers';
import { PointerSensor, KeyboardSensor, PointerActivationConstraints} from '@dnd-kit/dom';

interface CategoryComponent{
  categoryId: string;
  category: Category;
  categoryChannels: Channel[];
  index: number;
  container: React.RefObject<HTMLDivElement | null>;
}

interface ChannelComponent{
  categoryId: string;
  channel: Channel;
  index: number;
  container: React.RefObject<HTMLDivElement | null>;
}

const sensors = [
  PointerSensor.configure({
    activatorElements(source){
      return [source.element, source.handle]
    },
    activationConstraints: [
      new PointerActivationConstraints.Delay({value: 100, tolerance: 50})
    ]
  }),
  KeyboardSensor
]


const ChannelComponent = memo(function ChannelComponent({
  categoryId,
  channel,
  index,
  container,
}: PropsWithChildren<ChannelComponent>){

  const group = categoryId;
  const name = channel.channelName

  const operation = useDragOperation();
  const { handleRef, ref } = useSortable({
    id: channel.channelId,
    group,
    accept: "channel",
    type: "channel",
    modifiers: [
      RestrictToVerticalAxis,
      RestrictToElement.configure({
        element: container.current
      })
    ],
    index,
    data: {group, name}
  })

  if (!channel || !categoryId) return <div>Unknown Channel</div>

  const isDraggingMe = channel.channelId === operation.source?.id;

  return (
    <div className="flex flex-col w-full relative">
      

      <div
        ref={ref}
        className={`flex items-center justify-between 
          text-[17px] font-semibold py-1 my-1 
          cursor-pointer rounded-md px-2 group
          ${isDraggingMe ? "opacity-30 bg-gray-800/20" : "hover:bg-white/5"}
        `}
      >
        <div ref={handleRef} className="flex items-center gap-2 w-full select-none">
          <span className="text-gray-500 font-normal">#</span>
          <p className={isDraggingMe ? "text-gray-600" : "text-[#949BA4] group-hover:text-[#DBDEE1]"}>
            {channel.channelName}
          </p>
        </div>
      </div>
    </div>
  )
})

const CategoryComponent = memo(function CategoryComponent({
  category,
  index,
  categoryChannels,
  container,
}: PropsWithChildren<CategoryComponent>){

  const {handleRef, isDragging, ref} = useSortable({
    id: category.categoryId || "",
    accept: ["category", "channel"],
    modifiers: [
      RestrictToVerticalAxis,
      RestrictToElement.configure({
        element: container.current
      })
    ],
    type: "category",
    index: index
  });

  if (!category || !category.categoryId) return <div>Unknown Category</div>

  return (
    <div
      ref={ref}
      data-shadow={isDragging || undefined}
      className="pt-2 text-[14px] pl-1 flex justify-between
      items-center cursor-pointer hover:text-[#DBDEE1] group"
    >
      <div className="relative">
        <p ref={handleRef}>{category.categoryName}</p>
        <div>
          {(categoryChannels || []).map((channel: Channel, index: number) => (
            <ChannelComponent 
              categoryId={channel.categoryId || ""}
              channel={channel}
              index={index}
              container={container}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

const DummyServerPage = () => {

  const channelContainerRef = useRef<HTMLDivElement>(null)
  const [serverCategories, setServerCategories] = useState<Category[]>(serverChannelExample)
  const [isDragStart, setIsDragStart] = useState(false)
  const snapshot = useRef(structuredClone(serverCategories))

  console.log(serverCategories)

  return (
    <div className="flex w-full h-screen">
      <div className="bg-[#111113] shrink-0 text-white
        border-x border-[#363c41] truncate w-70 overflow-hidden" id="channel-list" >
          
          <div className="flex justify-between items-center 
            px-2 border-b border-[#363c41] relative">
              
            <div className="font-bold flex items-center 
              cursor-pointer hover:bg-white/10 p-2 rounded-md">
              <p>Server Name</p>
            </div>

          </div>

          {/* Channel List */}
          <DragDropProvider
            sensors={sensors}
            onDragStart={useCallback<DragDropEventHandlers['onDragStart']>(() => {
              snapshot.current = structuredClone(serverCategories)

              setIsDragStart(true)
            }, [serverCategories])}

            onDragOver={useCallback<DragDropEventHandlers['onDragOver']>((event) => {

              const { source } = event.operation;

              if (source && source.type == "category"){
                return;
              }

              //setServerCategories((channels) => move(channels, event))
            }, [])}

            onDragEnd={useCallback<DragDropEventHandlers["onDragEnd"]>((event) => {
              setIsDragStart(false)
              if (event.canceled){
                setServerCategories(snapshot.current)
                return;
              }
            }, [])}
            >
            <div 
              className="flex flex-col px-1 text-[#949BA4] relative h-190  overflow-y-auto overflow-x-hidden"
              ref={channelContainerRef}
              >
              {(serverCategories || []).map((category: Category, index: number) => (
                <CategoryComponent 
                  category={category}
                  container={channelContainerRef}
                  index={index}
                  categoryId={category.categoryId || ""}
                  categoryChannels={category.categoryChannels}
                />
              ))}

              {
                isDragStart && (
                  <DragOverlay>
                    {source => (
                      <div
                        className="bg-gray-500 w-60 rounded-md opacity-70"
                      >
                        {source.data.name}
                      </div>
                    )}
                  </DragOverlay>
                )
              }
            </div>
          </DragDropProvider>
      </div>

      <div>
        <div className="bg-[#23272a] flex flex-col flex-1 border-r 
            border-[#363c41] text-[#DBDEE1] h-full overflow-hidden pr-10">

            <div className="py-6 mb-8 border-b border-[#363c41]"></div>

            <div className="w-200">
              <div className="flex-1 flex flex-col w-full min-h-0 mb-auto overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="mb-7">
                      <div className="flex">
                        <div className="h-10 w-12 rounded-full bg-[#202024]"></div>
                        <div className="h-5 bg-[#202024] my-2 w-40 animate-pulse gap-2 ml-1  rounded-md"></div>
                      </div>
                      
                      {[...Array(2)].map((_, index) => (
                        <div key={index} className="h-7 bg-[#202024] my-2 animate-pulse gap-2 ml-15 w-70 rounded-md"></div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
            

            <div className=" mt-auto m-3">
              <div className="p-4 flex-none relative h-15 rounded-md bg-[#111314] animate-pulse"></div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default DummyServerPage