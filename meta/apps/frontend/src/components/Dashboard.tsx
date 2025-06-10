import React, { useEffect, useState } from 'react'
import { auth } from '../auth/auth'
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Dashboard() {

    const navigate = useNavigate();
    const removeToken  = auth.removeToken
    const [spaces,setSpace] = useState<{id:string,name:string,thumbnail:string,dimensions:string}[]>([]);
    const [user,setUser] = useState<{id:string|"",username:string,type:string,avatar:string|""}>()
    function handleLogout()
    {
        removeToken();
        navigate('/signin');
    }
    useEffect(()=>{
        api.get<any>('/user/getuserdetails')
        .then((res)=>setUser(res.data.user))
        .catch((err)=>console.log(err+" error fecthing user details"));
        //--------------------------------------------------------------
        api.get<any>("space/all")
        .then((res)=>setSpace(res.data.spaces || []))
        .catch((err)=>console.log(err+" error fetching spaces!"));
    },[])
  return (
    <div>

    </div>
  )
}

export default Dashboard