import { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryPage() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    price: '',
    genre: '',
    platform: '',
    stock_quantity: '',
    imageURL: '', // added imageURL field
  });
  const [editingGame, setEditingGame] = useState(null);

  const fetchGames = () => {
    axios
      .get('http://localhost:5000/admin/games')
      .then((response) => setGames(response.data))
      .catch((error) => console.error('Error fetching games:', error));
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleAddGame = () => {
    const gameToSend = {
      ...newGame,
      imageURL: newGame.imageURL.trim() !== '' ? newGame.imageURL : 'https://i.ibb.co/4gTPy2D7/1.png',
    };
  
    axios
      .post('http://localhost:5000/admin/add-game', gameToSend)
      .then((response) => {
        alert(response.data.message);
        fetchGames();
        setNewGame({
          title: '',
          description: '',
          price: '',
          genre: '',
          platform: '',
          stock_quantity: '',
          imageURL: '',
        });
      })
      .catch((error) => console.error('Error adding game:', error));
  };
  

  const handleEditGame = (game) => {
    setEditingGame({ ...game });
  };

  const handleSaveEditedGame = () => {
    axios
      .put(`http://localhost:5000/admin/edit-game/${editingGame.game_id}`, editingGame)
      .then((response) => {
        alert(response.data.message);
        fetchGames();
        setEditingGame(null);
      })
      .catch((error) => console.error('Error updating game:', error));
  };

  const handleDeleteGame = (game_id) => {
    axios
      .delete(`http://localhost:5000/admin/delete-game/${game_id}`)
      .then((response) => {
        alert(response.data.message);
        fetchGames();
      })
      .catch((error) => console.error('Error deleting game:', error));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Inventory Management</h2>

      {/* Add new game form */}
      <div className="mb-10 bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-blue-500 mb-4">Add New Game</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['title', 'description', 'price', 'genre', 'platform', 'stock_quantity', 'imageURL'].map((field) => (
            <input
              key={field}
              type={field === 'price' || field === 'stock_quantity' ? 'number' : 'text'}
              value={newGame[field]}
              onChange={(e) => {
                const value = e.target.value;
                // Prevent negative values
                if (field === 'price' || field === 'stock_quantity') {
                  if (Number(value) < 0) return; // do nothing if negative
                }
                setNewGame({ ...newGame, [field]: value });
              }}
              placeholder={field.replace('_', ' ').toUpperCase()}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>
        <button
          onClick={handleAddGame}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add Game
        </button>
      </div>

      {/* List of games */}
      <div>
        <h3 className="text-2xl font-semibold text-blue-500 mb-4">Games List</h3>
        <ul className="space-y-6">
          {games.map((game) => (
            <li key={game.game_id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 ">
                  <img
                    src={game.imageURL}
                    alt={game.title}
                    className="w-32 h-40 object-cover rounded-lg mb-2"
                  />
                  <p className="text-lg font-bold text-blue-600">{game.title}</p>
                  <p className="text-gray-600">{game.platform} | {game.genre}</p>
                  <p className="text-gray-500">${game.price} - Stock: {game.stock_quantity}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditGame(game)}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGame(game.game_id)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editingGame?.game_id === game.game_id && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-blue-500 font-semibold mb-2">Edit Game</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['title', 'description', 'price', 'genre', 'platform', 'stock_quantity', 'imageURL'].map((field) => (
                      <input
                        key={field}
                        type={field === 'price' || field === 'stock_quantity' ? 'number' : 'text'}
                        value={editingGame[field]}
                        onChange={(e) => {
                          const value = e.target.value;
                          if ((field === 'price' || field === 'stock_quantity') && Number(value) < 0) return;
                          setEditingGame({ ...editingGame, [field]: value });
                        }}
                        
                        placeholder={field.replace('_', ' ').toUpperCase()}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleSaveEditedGame}
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default InventoryPage;
