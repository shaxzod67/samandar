import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { MdDelete } from "react-icons/md";
import { db } from '../firebase';

const Zakazlar = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'orders'));
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
                // Handle error fetching data
            }
        };

        fetchOrders();
    }, []);

    // Function to delete an order
    const handleDeleteOrder = async (orderId) => {
        try {
            await deleteDoc(doc(db, 'orders', orderId));
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
            // Handle error deleting data
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Mahsulotlar
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Ismi
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Telephone
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Yetkazib berish manzil
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Qo'shimcha malumot
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Jami narxi
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-200 dark:border-strokedark">
                    <td className="border-b border-gray-200 py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      {/* Display items */}
                      {order.items && order.items.map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <img src={item.img} alt={item.name} className="rounded-full" width="40" height="40" />
                          <div>
                            <p className="font-medium text-black dark:text-white">{item.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Soni: {item.quantity}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Price: ${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="border-b border-gray-200 py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{order.itemName}</p>
                    </td>
                    <td className="border-b border-gray-200 py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{order.tel}</p>
                    </td>
                    <td className="border-b border-gray-200 py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{order.shippingAddress || 'Not available'}</p>
                    </td>
                    <td className="border-b border-gray-200 py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{order.description || 'Not available'}</p>
                    </td>
                    <td className="border-b border-gray-200 py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">${order.totalPrice || 'Not available'}</p>
                    </td>
                    <td className="border-b border-gray-200 py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button onClick={() => handleDeleteOrder(order.id)} className="hover:text-primary">
                        <MdDelete className='och' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    );
};

export default Zakazlar;
