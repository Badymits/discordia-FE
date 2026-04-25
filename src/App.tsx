import { Routes, Route } from "react-router-dom"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Login from "./pages/Login"
import Home from "./pages/Home"
import Register from "./pages/Register"
import PrivateRoute from "./utils/PrivateRoute"
import Layout from "./components/Layout"
import ServerComponents from "./components/ServerComponents/ServerComponents"
import { ServerProvider } from "./context/ServerContext"
import DirectMessage from "./pages/DirectMessage"
import HomeLayout from "./pages/HomeLayout"
import { WebSocketProvider } from "./context/WebSocketContext"


function App() {

  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          <ServerProvider>
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route element={<Layout />}>

                  {/* When opening discord, it shows friend list and activity feed of friends. */}
                  <Route element={<HomeLayout />}>
                    <Route index element={<Home />}/>
                    <Route path="/messages/:username" element={<DirectMessage />}/>
                  </Route>

                  <Route path="/server/:serverName/:serverId" element={<ServerComponents />} />  
                </Route> 

              </Route>
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register />}/>
            </Routes>
          </ServerProvider>
        </WebSocketProvider>
      </QueryClientProvider>
      
    </>
  )
}

export default App
