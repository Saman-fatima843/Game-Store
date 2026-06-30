import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function GameCard1({ game, onAddToCart }) {
    const [hovered, setHovered] = useState(false);
    const [added, setAdded] = useState(false);
    const navigate = useNavigate();
  
    const handleCardClick = () => {
      navigate(`/product/${game.game_id}`);
    };
  
    const handleAddToCart = (e) => {
      e.stopPropagation(); // Prevent navigating to details
     const user=localStorage.getItem("user");
     if(!user){
alert("Login First");
navigate('/login');
return;
     }
      onAddToCart(game.game_id);
      setAdded(true);
    };
  
    return (
      <div
        key={game.game_id}
        className="bg-blue-300  rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition transform duration-300 cursor-pointer flex flex-col relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setAdded(false); // Reset on hover out
        }}
        onClick={handleCardClick}
      >
        <img src={game.imageURL} alt={game.title} className=" w-[450px] h-[500px] object-cover" />
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{game.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{game.category}</p>
          <span className="text-indigo-600 font-bold">{game.price}$</span>
        </div>
  
        {/* Add to Cart button always occupies space, but is hidden smoothly */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 font-semibold transition-opacity duration-300 ${
            added
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          } ${hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          {added ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    );
  }
  