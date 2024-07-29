import React from 'react';
import { useCart } from 'react-use-cart';

const Heart = () => {
    const { items, removeItem } = useCart();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl mb-4">Yoqtirishlar</h1>
            {items.length === 0 ? (
                <p></p>
            ) : (   
                <div>
                    {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <img src={item.img} alt={item.category} className="w-16 h-16 object-cover rounded mr-4" />
                                <div>
                                    <p className="font-bold">{item.category}</p>
                                    <p>${item.price} x {item.quantity}</p>
                                </div>
                            </div>
                            
                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    onClick={() => removeItem(item.id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Heart;
