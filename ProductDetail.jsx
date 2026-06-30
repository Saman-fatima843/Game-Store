import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import GameCard from './GameCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [hoverImage, setHoverImage] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    // Fetch the product by ID
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/games/${id}`);

        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);

        // Fetch related products after product is loaded
        fetchRelatedProducts(data.game_id);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchRelatedProducts = async (currentProductId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/games/${currentProductId}/related`);
        if (!response.ok) throw new Error('Failed to fetch related products');
        const data = await response.json();
        setRelatedProducts(data);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };
    

    fetchProduct();
  }, [id]);

  
  const handleAddToCart = async (game) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.id;  // ✅ Grab from localStorage
  
      if (!userId) {
        console.error('User not logged in');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          gameId: product.game_id,
          quantity: 1,
        }),
      });
      setAddedToCart(true)
      if (!response.ok) throw new Error('Failed to add to cart');
      console.log(`Game ID ${product.game_id} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  

  const toggleFavorite = () => {
    setFavorited(!favorited);
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!product) {
    return <div className="text-center py-16">Loading...</div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto my-auto p-6 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left: Image with hover swap */}
      <div
        className="rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105 mb-12 h-[650px] "
        onMouseEnter={() => setHoverImage(true)}
        onMouseLeave={() => setHoverImage(false)}
      >
        <img
          src={hoverImage ? product.imageURL : product.imageURL}
          alt={product.title}
          className="w-full h-full "
        />
      </div>

      {/* Right: Details */}
      <div className="flex flex-col justify-between py-10 md:py-28">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-blue-500">{product.title}</h2>
          <p className="text-gray-500 mb-2 text-sm uppercase">{product.category}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
           {/* Platform Badge */}
           <div className='flex p-3 justify-around  space-x-24 '>

           <div
          className={` w-20 -mx-14  items-center px-3 py-1 rounded-md text-sm font-semibold ${
            product.platform === 'PS5'
            ? 'bg-gray-200 text-gray-700'
            : 'bg-green-200 text-green-700'
          }`}
          >
          {product.platform === 'PS5' ? (
            <span>🎮 PS5</span>
          ) : (
            <span>🎮 Xbox</span>
          )}
        </div>

          <div className="text-2xl font-semibold text-indigo-600  ">{product.price}$</div>
            </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4  px-12" >
            <button
              onClick={()=>handleAddToCart(product)}
              className={`flex-1 py-3 rounded-lg font-semibold text-white transition ${
                addedToCart
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
              >
              {addedToCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-3 rounded-lg border hover:bg-gray-100 transition ${
                favorited ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              <Heart fill={favorited ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="md:col-span-2 mt-12 p-4 mx-auto w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">
            🎮 Related Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.game_id}
                className="cursor-pointer transform transition-all hover:scale-105"
                onClick={() => handleCardClick(relatedProduct.game_id)}
              >
                <div className="relative w-full h-0 pb-[100%]">
                  <GameCard game={relatedProduct} onClick={() => handleCardClick(relatedProduct.game_id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
