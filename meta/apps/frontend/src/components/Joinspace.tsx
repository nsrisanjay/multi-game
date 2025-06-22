import React from 'react'
import { useState,useEffect } from 'react'
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom'
function Joinspace() {
  const navigate = useNavigate();
  const [spaces,setSpaces] = useState<{
    id:string,
    thumbnail:string,
    height:number,
    width:number,
    mapId:string,
    name:string
  }[]>([])
  useEffect(()=>{
    api.get<any>('/space/allspaces')
    .then(res=>setSpaces(res.data.spacesAvailable))
    .catch(err=>console.log(err))
  },[]);

  function navigateFunc(spaceId:string)
  {
    const spaceGoingto = spaces.find(space => spaceId ===space.id);
    const mapId = spaceGoingto?.mapId
    const width = spaceGoingto?.width
    const height = spaceGoingto?.height
    navigate(`/multi-space/${spaceId}?mapId=${mapId}&width=${width}&height=${height}`);
  }
  return (
    <div>
      {spaces.length === 0 ? (
  <p>No current public spaces....sorry!</p>
) : (
  <div className="flex flex-wrap gap-4 mt-4">
    {spaces.map(space => (
      <div
        key={space.id}
        className="w-72 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <img
          src={space.thumbnail}
          alt="thumbnail"
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h1 className="text-lg font-semibold mb-2">{space.name}</h1>
          <button
            onClick={() => navigateFunc(space.id)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Join Space
          </button>
        </div>
      </div>
    ))}
  </div>
)}
    </div>
  )
}

export default Joinspace