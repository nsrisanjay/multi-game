import React, { useEffect,useState } from 'react'
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

function ExploreSpace() {
  const [spaces,setSpace] = useState<{ id: string, name: string, thumbnail: string, dimensions: string }[]>([]);
  const navigate = useNavigate();
  useEffect(()=>{
    api.get<any>("/space/all")
          .then((res) => setSpace(res.data.spaces || []))
          .catch((err) => console.log(err + " error fetching spaces data"));
  },[])

  function func(spaceId:string)
  {
      navigate(`/mapExplore/${spaceId}`);
  }
  return (
    <div>
        {spaces.length === 0 ? (
  <p>No current spaces. Create one to explore!</p>
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
            onClick={()=>func(space.mapId)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Explore Space
          </button>
        </div>
      </div>
    ))}
  </div>
)}
    </div>
  )
}

export default ExploreSpace