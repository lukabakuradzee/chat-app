import React from 'react'
import { Link } from 'react-router-dom'
import { HOME_PAGE } from '../../constants/routes'

function BackButton() {
  return (
    <div>
        <Link to={HOME_PAGE}>
        <button className="back-home-button">
            Back To Home
        </button>
        </Link>
    </div>
  )
}

export default BackButton