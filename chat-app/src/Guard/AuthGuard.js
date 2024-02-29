import React from 'react'
import { useAuthContext } from '../context/auth/AuthContextProvider'

function AuthGuard({children}) {
    const {state} = useAuthContext();
  return (
    <>
    {state.isAuthenticted ? (
        children
      ) : (
    <div>
        <h1>Chat App</h1>
    </div>
    )}
    </>
  )
}

export default AuthGuard