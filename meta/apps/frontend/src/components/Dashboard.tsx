import React, { useEffect, useState } from 'react'
import { auth } from '../auth/auth'
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Dashboard() {

    const navigate = useNavigate();
    const removeToken  = auth.removeToken
    const [spaces,setSpace] = useState<{id:string,name:string,thumbnail:string,dimensions:string}[]>([]);
    const [user,setUser] = useState<{id:string,username:string,avatar:string,type:string}>()
    function handleLogout()
    {
        removeToken();
        navigate('/signin');
    }
    useEffect(()=>{
        api.get<any>('/user/getuserdetails')
        .then((res)=>{setUser(res.data.user);console.log("fetched")})
        .catch((err)=>console.log(err+" error fecthing user details"));
        console.log(user)
        //--------------------------------------------------------------
        api.get<any>("space/all")
        .then((res)=>setSpace(res.data   || []))
        .catch((err)=>console.log(err+" error fetching spaces!"));
        console.log(spaces)
    },[])
    let url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s"
  return (
    <div>
      <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      {user?.username}
      <br/>
      {user?.id}
      <br/>
      {
        url = user?.avatar? user.avatar : url
      }
      <p>avatar image</p>
      <img src={url} />
      <br />
      {user?.type}
      <h1>
        spaces
      </h1>
      
    </div>
  )
}

export default Dashboard