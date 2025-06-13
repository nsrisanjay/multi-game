import { useEffect, useState } from 'react';
import { auth } from '../auth/auth';
import { useNavigate } from 'react-router-dom';
import { api, publicApi } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const removeToken = auth.removeToken;

  const [spaces, setSpace] = useState<{ id: string, name: string, thumbnail: string, dimensions: string }[]>([]);
  const [user, setUser] = useState<{ id: string, username: string, avatar: string, type: string }>();
  const [maps, setMaps] = useState<{ id: string, name: string, dimensions: string, thumbnail: string }[]>([]);
  const [newSpace, setNewSpace] = useState<{ name: string, dimensions: string, mapId: string }>({ name: "", dimensions: "", mapId: "" });

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

  const handleLogout = () => {
    removeToken();
    navigate('/signin');
  };

  const handleCreateSpace = () => {
    api.post('/space', newSpace)
      .then(() => {
        setCreateModalOpen(false);
        window.location.reload();
      })
      .catch(err => console.log("Error creating space", err));
  };

  const avatarUrl = user?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s";

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>

      <button
        onClick={() => setCreateModalOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Create Space
      </button>

      {/* Create Space Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 space-y-4">
            <h2 className="text-xl font-semibold">Create New Space</h2>

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

            {/* Custom Dropdown with Map Thumbnails */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full border px-3 py-2 rounded text-left bg-white"
              >
                {maps.find(m => m.id === newSpace.mapId)?.name || "Select a Map"}
              </button>

              {dropdownOpen && (
                <div className="absolute mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow z-10">
                  {maps.map(map => (
                    <div
                      key={map.id}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setNewSpace({ ...newSpace, mapId: map.id });
                        setDropdownOpen(false);
                      }}
                    >
                      <img src={map.thumbnail} alt="thumb" className="w-12 h-12 object-cover rounded mr-3" />
                      <span>{map.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleCreateSpace} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Space Details Modal */}
      {detailModalOpen && selectedSpace && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 space-y-4">
            <h2 className="text-xl font-bold">{selectedSpace.name}</h2>
            <img src={selectedSpace.thumbnail} alt="Space Thumbnail" className="w-full h-40 object-cover rounded" />
            <p>Dimensions: {selectedSpace.dimensions}</p>
            <div className="flex justify-end">
              <button onClick={() => setDetailModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* List of Spaces */}
      <h1 className="text-2xl font-bold mt-4">Spaces</h1>
      {spaces.length === 0
        ? <p>No current spaces. Create one to see them here</p>
        : spaces.map(space => (
          <div key={space.id} className="border p-4 rounded mb-2 shadow">
            <h1 className="text-lg font-semibold">{space.name}</h1>
            <img src={space?.thumbnail} alt="thumbnail" className="w-48 h-28 object-cover my-2 rounded" />
            <button
              onClick={() => {
                setSelectedSpace(space);
                setDetailModalOpen(true);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Details
            </button>
          </div>
        ))}

      {/* Maps list */}
      <h1 className="text-2xl font-bold mt-6">Maps</h1>
      {maps.map((map, idx) => (
        <p key={idx}>{map.id}</p>
      ))}

      {/* User Info */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">User Info</h2>
        <p>Username: {user?.username}</p>
        <p>ID: {user?.id}</p>
        <p>Type: {user?.type}</p>
        <img src={avatarUrl} alt="User Avatar" className="w-32 h-32 rounded-full mt-2" />
      </div>
    </div>
  );
}

export default Dashboard;
