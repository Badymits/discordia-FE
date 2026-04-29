import React, { useEffect, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchChannel } from '../../query/serverQueries'

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import {
  $getRoot,
  $getSelection, 
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  CLEAR_HISTORY_COMMAND, 
  type LexicalEditor,
  $createParagraphNode,
  $createTextNode
} from 'lexical';
import { updateChannel } from '../../services/serverService';
import type { Channel, UpdateChannelPayload } from '../../types/ServerTypes';


interface Props {
  channelId: string;
  setChannelNameState: React.Dispatch<React.SetStateAction<string>>;
}


function onError(error: Error):void {
  console.error(error)
}

const SLOWMODE_OPTIONS = [
  "Off",
  "5 seconds",
  "10 seconds",
  "15 seconds",
  "20 seconds",
  "25 seconds",
  "30 seconds",
  "1 minute",
  "2 minutes",
  "5 minutes",
  "10 minutes",
  "15 minutes",
  "30 minutes",
  "1 hour",
  "2 hours",
  "6 hours",
]


// Set the text in the RIch Text Editor to Bold, Italic, or Underline text toptions
const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext()
  const [textOptionActive, setTextOptionActive] = useState<Record<string, boolean>>({
    "B": false,
    "I": false,
    "U": false
  })
  useEffect(() => {
  return editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setTextOptionActive({
          B: selection.hasFormat('bold'),
          I: selection.hasFormat('italic'),
          U: selection.hasFormat('underline'),
        });
      }
    });
  });
}, [editor]);

  const onClick = (format: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  } 

  return (
    <div className='flex gap-2 p-1 -mb-10 bg-[#2b2d31] rounded-t-md border-b border-[#393d41] '>
      <button
        onClick={() => {
          setTextOptionActive(prev => ({
            ...prev, // Kopyahin lahat ng existing values (I, U)
            "B": !prev.B // I-toggle lang si B
          }));
          onClick('bold')
        }}
        className={`px-2 py-1 hover:bg-[#3f4147] ${textOptionActive.B === true && "bg-[#3f4147]"}
          rounded font-bold text-white`}
      >
        B
      </button>
      <button
        onClick={() =>{
          setTextOptionActive(prev => ({
            ...prev, // Kopyahin lahat ng existing values (I, U)
            "I": !prev.I // I-toggle lang si B
          }));
          onClick('italic')
        }}
        className={`px-2 py-1 hover:bg-[#3f4147] ${textOptionActive.I === true && "bg-[#3f4147]"}
          rounded italic text-white`}
      >
        I
      </button>
      <button
        onClick={() => {
          setTextOptionActive(prev => ({
            ...prev, 
            "U": !prev.U 
          }));
          onClick('underline')
        }}
        className={`px-2 py-1 hover:bg-[#3f4147] ${textOptionActive.U === true && "bg-[#3f4147]"}
          rounded underline text-white`}
      >
        U
      </button>
    </div>
  )
}

const ResetText = ({editorRef}: {editorRef: React.MutableRefObject<LexicalEditor | null>}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editorRef.current = editor;
  }, [editor, editorRef]);
  return null;
}


const OverviewComponent = ({channelId, setChannelNameState}: Props) => {

  const queryClient = useQueryClient();

  // For lexical text editor
  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
    },
    onError
  }

  const {
    data: selectedChannel,
    isLoading,
    isError: queryError
  } = useQuery({
    ...fetchChannel(channelId),
    enabled: !!channelId
  })
  console.log(channelId)
  console.log(selectedChannel)


  const {
    mutate: updateChannelMutate,
    isPending,
    isError: mutateError
  } = useMutation({
    mutationKey: ['updateChannel'],
    mutationFn: async (channelData: UpdateChannelPayload) => 
      await updateChannel(channelData, channelId),

    onMutate: async (updateChannelData) => {
      await queryClient.cancelQueries({ queryKey: ["channel", selectedChannel?.channelId]})

      const channel = queryClient.getQueryData(["channel", selectedChannel?.channelId])

      if (!channel) return;


      queryClient.setQueryData(["channel", selectedChannel?.channelId], (channel: Channel) => {
        
        return {
          ...channel,
          channelName: updateChannelData.channelName,
          channelTopic: updateChannelData.channelTopic
        }
      })

      return { channel }
    },

    onError: (error, _variables, context) => {
      console.error(error)
      queryClient.setQueryData(["channel", selectedChannel?.channelId], context?.channel)
    },

    onSuccess: (response) => {
      console.log("response on updated channel: ", response.data)
      queryClient.invalidateQueries({queryKey: ["channel", selectedChannel?.channelId]})
      //queryClient.invalidateQueries({queryKey: [""]})
      setHasChanges(false)
      
    }
  })

  const [channelName, setChannelName] = useState<string>( selectedChannel?.channelName ?? "")
  
  const [channelTopic, setChannelTopic] = useState<string>( selectedChannel?.channelTopic ?? "")

  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [slowModeOption, setSlowModeOption] = useState<string>("")

  const editorRef = useRef<LexicalEditor | null>(null)


  const formatChannelName = (name: string) => {
    const format =  name.toLowerCase().replace(/\s+/g, '-')

    setChannelNameState(format)
    setChannelName(format)
  }



  const handleUpdateChannel = () => {
    console.log("Updating Channel")

    if (!selectedChannel?.channelId){
      console.log("Cannot proceed without channel ID!")
      return;
    }


    if (!channelName){
      console.log("Name ref not found")
      return;
    }

    const channelPayload: UpdateChannelPayload = {
      channelName: channelName,
      channelTopic: channelTopic
    }


    updateChannelMutate(channelPayload)
    return;
  }

  console.log(channelName)

  if (queryError || mutateError){
    return <div>
      <p>Cannot Render Component Please try again later</p>
    </div>
  }

  return (
    <div className="w-full">
      <p className="text-2xl font-semibold">Overview</p>

      {/* Channel Name */}
      <div>
        <p className='font-semibold my-1'>Channel Name</p>
        <input 
          type="text" 
          disabled={isLoading}
          value={channelName}
          onChange={(e) => {
            setHasChanges(true)
           
            formatChannelName(e.target.value)
          }}
          className="bg-[#19191b] focus:outline-[#4567df] outline-2 outline-[#393d41] 
            text-[#ffffff] p-2 rounded-md cursor-pointer block w-full mt-1"
        />
      </div>

      {/* Channel Topic */}
      <div className='mt-7 relative'>
        <p className='font-semibold my-2'>Channel Topic</p>
        <LexicalComposer 
          key={selectedChannel?.channelId}
          initialConfig={{
            ...initialConfig,
            editorState: () => {
              const root = $getRoot();
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(selectedChannel.channelTopic || ""));
              root.append(paragraph);
            }
          }}    
          >

          <div className='absolute z-50 w-full'>
            <ToolbarPlugin/>
          </div>
          
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className='h-70 w-full bg-[#19191b] outline-1 outline-[#393d41] rounded-md pt-12 px-3'
                onChange={() => setHasChanges(true)}
              />
            }
            // DITO DAPAT ANG PLACEHOLDER
            placeholder={
              <div className='absolute top-20 left-3 text-gray-400 pointer-events-none'> 

              {
                selectedChannel?.channelTopic 
                
                ? selectedChannel?.channelTopic
                : "Let everyone know how to use this channel!"
              }
                
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          {/* Huwag kalimutan ang HistoryPlugin para gumana ang undo/redo */}
          <HistoryPlugin /> 
          <OnChangePlugin 
            onChange={(editorState) => {
              editorState.read(() => {
                // retrieve plain text
                const root = $getRoot();
                const text = root.getTextContent();
                setChannelTopic(text)
                

              })
              setHasChanges(true)
            }}
            
          />
          <ResetText editorRef={editorRef}/>
        </LexicalComposer>
      </div>

      {/* Slowmode option */}
      <div className='mt-7 font-semibold'>
        <p>Slowmode</p>

        <select value={slowModeOption} 
          onChange={(e) => setSlowModeOption(e.target.value)}
          className='bg-[#19191b] w-full rounded-md p-2 my-1 focus:outline-[#4567df]
          outline-1 outline-[#393d41] overflow-hidden appearance-none'>

          {SLOWMODE_OPTIONS.map((opt, i) => (
            <option 
              value={opt} 
              key={i}
              className='hover:bg-white/10'
              >
                {opt}
            </option>
          ))}

        </select>
        <p className='text-gray-500 text-xs mt-1 '>
          Members will be restricted to sending one message and creating one thread per this interval, unless 
          they have the Bypass Slowmode permission
        </p>
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

                setChannelName(
                  selectedChannel?.channelName 
                  ? selectedChannel?.channelName
                  : "" 
                )

                if (editorRef.current){
                  editorRef.current.update(() => {
                    const root = $getRoot();
                    root.clear()
                    const paragraph = $createParagraphNode();
                    paragraph.append($createTextNode(selectedChannel.channelTopic || ""));
                    root.append(paragraph);

                  })
                  editorRef.current.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
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
              onClick={handleUpdateChannel}
            >
              Save Changes
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default OverviewComponent