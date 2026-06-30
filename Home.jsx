import { useState, useEffect } from 'react';
import GameCard1 from './GameCard1';

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = async (game) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;  // ✅ Grab from localStorage
  
      if (!userId) {
        console.error('User not logged in');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          gameId: game.game_id,
          quantity: 1,
        }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      console.log(`Game ID ${game.game_id} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games'); 
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">🎮 Welcome to GameStore!</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading games...</p>
      ) : games.length === 0 ? (
        <p className="text-center text-gray-500">No games available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard1
              key={game.game_id}
              game={game}
              onAddToCart={() => handleAddToCart(game)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
