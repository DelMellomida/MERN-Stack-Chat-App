import React from 'react'
import { useUserStore } from '../store/useUserStore'
import UsersContainer from '../components/UsersContainer';

const Friends = () => {
  const addFriend = useUserStore(state => state.addFriend);

  return (
    <div className="mt-40">
        <UsersContainer/>
    </div>
  )
}

export default Friends