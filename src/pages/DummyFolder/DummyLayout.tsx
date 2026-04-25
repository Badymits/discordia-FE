import React from 'react'
import { Link } from 'react-router-dom'

const DummyLayout = () => {
  return (
    <div>
      Dummy Layout Home ata toh boss
      <Link to={`/random`}>
        Click here to go to random component
      </Link>
    </div>
  )
}

export default DummyLayout