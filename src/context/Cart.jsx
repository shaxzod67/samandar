import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { onSnapshot, collection, doc, updateDoc, addDoc } from "firebase/firestore";
import { useCart } from "react-use-cart";
import { notification } from "antd";
import axios from 'axios';

const Cart = () => {
    const { items, updateItemQuantity, removeItem } = useCart();
    const [car, setCar] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemTel, setItemTel] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'blogs'), (snapshot) => {
            const updatedCar = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                price: doc.data().price // Ensure price is correctly accessed
            }));
            setCar(updatedCar);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const calculateTotalPrice = () => {
            let total = 0;
            items.forEach(item => {
                const firestoreItem = car.find(firebaseItem => firebaseItem.id === item.id);
                if (firestoreItem) {
                    total += parseFloat(firestoreItem.price) * item.quantity;
                }
            });
            setTotalPrice(total);
        };

        calculateTotalPrice();
    }, [items, car]);

    const handleIncreaseQuantity = (itemId) => {
        updateItemQuantity(itemId, items.find(item => item.id === itemId).quantity + 1);
    };

    const handleDecreaseQuantity = (itemId) => {
        const currentItem = items.find(item => item.id === itemId);
        if (currentItem.quantity > 1) {
            updateItemQuantity(itemId, currentItem.quantity - 1);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            removeItem(itemId);

            const itemRef = doc(db, 'blogs', itemId);
            await updateDoc(itemRef, { deleted: true });

        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const openModal = (itemId, itemName, itemTel) => {
        setItemName(itemName);

        const firestoreItem = car.find(firebaseItem => firebaseItem.id === itemId);
        if (firestoreItem) {
            setItemTel(firestoreItem.tel);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setItemName('');
        setItemTel('');
        setShippingAddress('');
        setDescription('');
        setIsModalOpen(false);
    };

    const handleModalSubmit = async () => {
        if (!itemName || !itemTel || !shippingAddress || !description) {
            console.error("Please fill all required fields.");
            return;
        }

        try {
            const orderItems = items.map(item => ({
                id: item.id,
                name: item.category,
                quantity: item.quantity,
                img: item.img,
                price: car.find(firebaseItem => firebaseItem.id === item.id).price
            }));

            const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            const orderObject = {
                items: orderItems,
                itemName: itemName,
                tel: itemTel,
                totalPrice: total.toFixed(2),
                shippingAddress: shippingAddress,
                description: description,
                createdAt: new Date()
            };

            await addOrderToFirestore(orderObject);

            setIsModalOpen(false);
            items.forEach(item => removeItem(item.id));

            // Send message to Telegram bot
            sendOrderToTelegram(orderObject);

            notification.success({
                message: "Zakazingiz qabul qilindi",
                description: "Tez orada siz bilan aloqaga chiqamiz"
            });

        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    const addOrderToFirestore = async (orderObject) => {
        try {
            const newOrderRef = await addDoc(collection(db, 'orders'), orderObject);
            console.log("Document written with ID: ", newOrderRef.id);
        } catch (error) {
            console.error("Error adding order:", error);
        }
    };

    const sendOrderToTelegram = async (orderObject) => {
        const chatId = '2064892837'; // Your Telegram user ID
        const botToken = '7299336277:AAHt5tZzrdqItQFMJV54of4PoiyV7k2Q0nY'; // Your Telegram bot token

        const message = `
            📦 Yangi zakaz:
            
            📋 **Qabul qiluvchining malumotlari**
            - Ismi: ${orderObject.itemName}
            - Phone: ${orderObject.tel}
            - Yetkazib berish manzili: ${orderObject.shippingAddress}
            - Malumoti: ${orderObject.description}
            - Jami narxi: $${orderObject.totalPrice}
            
            **Mahsulot:**
            ${orderObject.items.map(item => `
                - ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
            `).join('\n')}
        `;

        try {
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            });
            console.log("Message sent to Telegram");
        } catch (error) {
            console.error("Error sending message to Telegram:", error);
        }
    };

    return (
        <section className="text-gray-600 body-font">
             <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Xarid qilish</h1>
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Product</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Quantity</th>
                                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Total</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => {
                                    const firestoreItem = car.find(firebaseItem => firebaseItem.id === item.id);
                                    return (
                                        <tr key={item.id}>
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <div className="flex items-center">
                                                    <img className="w-16 h-16 object-cover object-center" src={item.img} alt={item.category} />
                                                    <div className="ml-4">
                                                        <h5 className="font-medium text-black dark:text-white">{item.category}</h5>
                                                        <p className="text-sm text-gray-600">{item.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center">
                                                    <button onClick={() => handleDecreaseQuantity(item.id)} className="minus">-</button>
                                                    <span className="mx-2">{item.quantity}</span>
                                                    <button onClick={() => handleIncreaseQuantity(item.id)} className="plus">+</button>
                                                </div>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <span>${firestoreItem ? (firestoreItem.price * item.quantity).toFixed(2) : 'Loading...'}</span>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <button className="text-red-500 hover:text-red-700" onClick={() => handleRemoveItem(item.id)}>O'chirish</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-8">
                    <p className="text-xl font-bold">Jami Summa: ${totalPrice.toFixed(2)}</p>
                </div>
            </div>

            <button className="zakaz" onClick={() => setIsModalOpen(true)}>Zakaz Berish</button>

            {isModalOpen && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Malumotlaringizni kiriting</h2>
                        <input
                            type="text"
                            name="itemName"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mb-4"
                            placeholder="Ismingiz"
                        />
                        <input
                            type="number"
                            name="itemTel"
                            value={itemTel}
                            onChange={(e) => setItemTel(e.target.value)}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mb-4"
                            placeholder="Telephone No'meringiz"
                        />
                        <input
                            type="text"
                            name="shippingAddress"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mb-4"
                            placeholder="Yetkazib berish manzili"
                        />
                        <textarea
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-32 bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mb-4 resize-none"
                            placeholder="Ma'lumotlaringizni kiriting..."
                        />
                        <div className="flex justify-end">
                            <button className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded mr-2" onClick={closeModal}>Close</button>
                            <button className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded" onClick={handleModalSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Cart;
