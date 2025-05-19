import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Poker Planning</h1>
      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2 p-2 border rounded w-64"
      />
      <input
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="mb-4 p-2 border rounded w-64"
      />
      <button
        onClick={() => navigate(`/room/${roomId}?name=${name}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Join Room
      </button>
    </div>
  );
}

export default App;
