import { useParams } from "react-router-dom"

const DummyOutlet = () => {

  const { serverId } = useParams();
  return (
    <div>
      Displaying Details for server: {serverId}
    </div>
  )
}

export default DummyOutlet