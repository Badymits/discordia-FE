import { Outlet } from "react-router-dom"
import DmAndChannelComp from "../components/DmAndChannelComp";


const HomeLayout = () => {


  return (
    <div className="flex w-full h-screen">
      {/* Friend or Messages /Server Channel lists */}
      <DmAndChannelComp />

      <Outlet />
    </div>
  )
}

export default HomeLayout