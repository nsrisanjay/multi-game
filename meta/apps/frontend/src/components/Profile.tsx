import React from 'react'
import { api } from '../services/api';
import { useEffect,useState } from 'react';

function Profile() {
    const [user, setUser] = useState<{ id: string, username: string, avatar: string, type: string,spaces:{id:string}[]}>();
    const avatarUrl = user?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s";

  useEffect(() => {
    api.get<any>('/user/getuserdetails')
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err + " error fetching user data"));
  },[])
  return (

      <div className="mt-6">
        <h2 className="text-xl font-semibold">User Info</h2>
        <p>Username: {user?.username}</p>
        <p>ID: {user?.id}</p>
        <p>Type: {user?.type}</p>
        <img src={avatarUrl} alt="User Avatar" className="w-32 h-32 rounded-full mt-2" />
        <p>Number of spaces created : {user?.spaces.length}</p>
      </div>
  )
}

export default Profile