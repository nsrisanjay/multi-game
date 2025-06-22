import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { api, publicApi } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();


  const [spaces, setSpace] = useState<{ id: string, name: string, thumbnail: string, dimensions: string }[]>([]);
  const [user, setUser] = useState<{ id: string, username: string, avatar: string, type: string }>();
  const [maps, setMaps] = useState<{ id: string, name: string, dimensions: string, thumbnail: string }[]>([]);
  const [newSpace, setNewSpace] = useState<{ name: string, dimensions: string, mapId: string,privacy:boolean }>({ name: "", dimensions: "", mapId: "",privacy:false });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<{ id: string, name: string, thumbnail: string, dimensions: string } | null>(null);

  useEffect(() => {
    api.get<any>('/user/getuserdetails')
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err + " error fetching user data"));

    api.get<any>("/space/all")
      .then((res) => setSpace(res.data.spaces || []))
      .catch((err) => console.log(err + " error fetching spaces data"));

    publicApi.get<any>('/maps')
      .then((res) => setMaps(res.data.maps))
      .catch((err) => console.log(err + " error fetching maps data"));
  }, []);

 

  const handleCreateSpace = () => {
    console.log(newSpace);
    api.post('/space', newSpace)
      .then(() => {
        setCreateModalOpen(false);
        window.location.reload();
      })
      .catch(err => console.log("Error creating space", err));
  };

  const avatarUrl = user?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s";
   const handlePrivacyChange = (value: boolean) => {
    setNewSpace(prev => ({ ...prev, privacy: value }));
  };
  return (
    <div className="p-4 space-y-4">
      

      <button
        onClick={() => setCreateModalOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Create Space
      </button>

      {/* Create Space Modal */}
      {createModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded shadow-md w-[600px] max-w-full space-y-6">
      <h2 className="text-2xl font-semibold">Create New Space</h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full border px-3 py-2 rounded"
        onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
      />

      <input
        type="text"
        placeholder="Dimensions"
        className="w-full border px-3 py-2 rounded"
        onChange={(e) => setNewSpace({ ...newSpace, dimensions: e.target.value })}
      />
      {/* Privacy selection */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="privacy"
            value="public"
            checked={!newSpace.privacy}
            onChange={() => handlePrivacyChange(false)}
          />
          <span>Public</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="privacy"
            value="private"
            checked={newSpace.privacy}
            onChange={() => handlePrivacyChange(true)}
          />
          <span>Private</span>
        </label>
      </div>
      {/* Map thumbnails as clickable buttons */}
<div>
  <p className="mb-2 font-medium">Select a Map:</p>
  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto border p-3 rounded">
    {maps.map((map) => {
      const isSelected = map.id === newSpace.mapId;
      return (
        <button
          key={map.id}
          onClick={() => setNewSpace({ ...newSpace, mapId: map.id })}
          className={`relative rounded border-4 p-1 focus:outline-none ${
            isSelected ? "border-blue-600" : "border-transparent"
          }`}
          type="button"
        >
          <img
            src={map.thumbnail}
            alt={map.name}
            className="w-full h-36 object-cover rounded"
          />
          {isSelected && (
            <span className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              ✓
            </span>
          )}
        </button>
      );
    })}
  </div>
</div>


      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setCreateModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateSpace}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create
        </button>
      </div>
    </div>
  </div>
)}


      {/* Space Details Modal */}
    {detailModalOpen && selectedSpace && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="relative bg-white p-6 rounded shadow-md w-96 space-y-4">
      
      <button
  onClick={() => setDetailModalOpen(false)}
  className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl cursor-pointer hover:scale-110 transition-transform"
  aria-label="Close"
>
  &times;
</button>

      <h2 className="text-xl font-bold">{selectedSpace.name}</h2>
      <img
        src={selectedSpace.thumbnail}
        alt="Space Thumbnail"
        className="w-full h-40 object-cover rounded"
      />
      <p>Dimensions: {selectedSpace.dimensions}</p>
      <div className="flex justify-end">
        <button
          onClick={() => setDetailModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded  hover:text-black text-xl cursor-pointer hover:scale-100 transition-transform"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

      {/* List of Spaces */}
      <h1 className="text-2xl font-bold mt-4">Spaces</h1>

{spaces.length === 0 ? (
  <p>No current spaces. Create one to see them here</p>
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
            onClick={() => {
              setSelectedSpace(space);
              setDetailModalOpen(true);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Details
          </button>
        </div>
      </div>
    ))}
  </div>
)}

     
    </div>
  );
}

export default Dashboard;
