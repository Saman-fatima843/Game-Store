import React from 'react';

function GameCard({ game, onClick }) {
  return (
    <div
      className="bg-blue-300 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition transform duration-300 cursor-pointer flex flex-col relative"
      onClick={() => onClick(game)}
    >
      {/* Square container for the card */}
      <div className="w-full aspect-w-1 aspect-h-1">
        <img src={game.imageURL} alt={game.title} className="w-full h-full object-cover" />
      </div>

      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{game.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{game.category}</p>
        <span className="text-indigo-600 font-bold">{game.price}$</span>
      </div>
    </div>
  );
}

export default GameCard;
