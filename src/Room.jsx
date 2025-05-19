import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { db } from './firebase';
import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  getDoc
} from 'firebase/firestore';

const cardOptions = ['1', '2', '3', '5', '8', '13', '20', '40', '100', '?'];

function Room() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const [players, setPlayers] = useState([]);
  const [reveal, setReveal] = useState(false);
  const [myVote, setMyVote] = useState(null);

  useEffect(() => {
    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPlayers(data.players || []);
        setReveal(data.reveal || false);
      }
    });
    return unsubscribe;
  }, [roomId]);

  useEffect(() => {
    const joinRoom = async () => {
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnap = await getDoc(roomRef);
      if (!roomSnap.exists()) {
        await setDoc(roomRef, { players: [], reveal: false });
      }
      await updateDoc(roomRef, {
        players: [...(roomSnap.data()?.players || []).filter(p => p.name !== name), { name, vote: null }]
      });
    };
    joinRoom();
  }, [roomId, name]);

  const castVote = async (vote) => {
    setMyVote(vote);
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    const updatedPlayers = roomSnap.data().players.map((p) =>
      p.name === name ? { ...p, vote } : p
    );
    await updateDoc(roomRef, { players: updatedPlayers });
  };

  const toggleReveal = async () => {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, { reveal: !reveal });
  };

  const resetRoom = async () => {
    const roomRef = doc(db, 'rooms', roomId);
    const resetPlayers = players.map(p => ({ ...p, vote: null }));
    await updateDoc(roomRef, { players: resetPlayers, reveal: false });
    setMyVote(null);
  };

  const numericVotes = players.map(p => parseInt(p.vote)).filter(n => !isNaN(n));
  const average = numericVotes.length > 0 ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(2) : 'N/A';

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Room: {roomId}</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {cardOptions.map((val) => (
          <button
            key={val}
            onClick={() => castVote(val)}
            className={`px-4 py-2 rounded border ${myVote === val ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={toggleReveal}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {reveal ? 'Hide Votes' : 'Reveal Votes'}
        </button>
        <button
          onClick={resetRoom}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset Room
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {players.map((p) => (
          <div key={p.name} className="p-2 border rounded">
            <p className="font-bold">{p.name}</p>
            <p>
              {reveal
                ? p.vote ?? '–'
                : p.vote
                  ? '✅'
                  : '❓'}
            </p>
          </div>
        ))}
      </div>
      {reveal && (
        <p className="mt-4 text-lg">Average: {average}</p>
      )}
    </div>
  );
}

export default Room;