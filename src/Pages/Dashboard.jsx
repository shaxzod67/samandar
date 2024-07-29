import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { Button, notification, Modal } from 'antd';

const Dashboard = () => {
    const [car, setCar] = useState([]);
    const [category, setCategory] = useState('');
    const [des, setDes] = useState('');
    const [img, setImg] = useState('');
    const [price, setPrice] = useState('');
    const [id, setId] = useState('');
    const [show, setShow] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'blogs'), (snapshot) => {
            const updatedCar = snapshot.docs.map(doc => ({
                ...doc.data(), id: doc.id
            }));
            setCar(updatedCar);
        });

        return () => unsubscribe();
    }, []);

    const handleCreate = async () => {
        if (!category || !des || !img || !price) {
            notification.error({
                message: "Data not submitted",
                description: "Please fill in all fields"
            });
            return;
        }
        
        const dataBase = collection(db, 'blogs');
        await addDoc(dataBase, {
            category: category,
            description: des,
            img: img,
            price: parseFloat(price), // Convert price to float (assuming it's a number)
            id: uuidv4()
        });

        notification.success({
            message: "Data submitted",
            description: "Data successfully added"
        });

        setCategory('');
        setDes('');
        setImg('');
        setPrice('');
        setIsModalVisible(false); // Close the modal after submission
    };

    const handleDelete = async (id) => {
        const deletePost = doc(db, 'blogs', id);
        await deleteDoc(deletePost);
        setCar(prevCars => prevCars.filter(item => item.id !== id));
    };

    const handleEdit = (category, des, img, id, price) => {
        setCategory(category);
        setDes(des);
        setImg(img);
        setPrice(price.toString()); // Convert price to string for input field
        setId(id);
        setShow(false); // Show modal for "Update Notes"
        setIsModalVisible(true); // Open modal
    };

    const handleUpdate = async () => {
        const updateData = doc(db, 'blogs', id);
        await updateDoc(updateData, { category, description: des, img, price: parseFloat(price) });
        setCar(prevCars => prevCars.map(item => {
            if (item.id === id) {
                return { ...item, category, description: des, img, price: parseFloat(price) };
            }
            return item;
        }));
        setShow(true);
        setCategory('');
        setDes('');
        setImg('');
        setPrice('');
        setId('');
        setIsModalVisible(false); // Close the modal after update
    };

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                    <h1 className="title-font font-medium text-3xl text-gray-900">Mahsulot Qo'shish</h1>
                    <p className="leading-relaxed mt-4">Yangi mahsulotlarni qo'shing va o'zgartiring</p>
                </div>
                <Button 
                    className="create text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg mb-4"
                    onClick={() => setIsModalVisible(true)}
                >
                    {show ? 'Create Product' : 'Update Product'}
                </Button>

                <Modal
                    title={show ? 'Create Product' : 'Update Product'}
                    visible={isModalVisible}
                    onOk={show ? handleCreate : handleUpdate}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setCategory('');
                        setDes('');
                        setImg('');
                        setPrice('');
                        setId('');
                        setShow(true);
                    }}
                    okText={show ? 'Create' : 'Update'}
                >
                    <div className="relative mb-4">
                        <label htmlFor="category" className="leading-7 text-sm text-gray-600">Category</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="Category"
                        />
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="description" className="leading-7 text-sm text-gray-600">Malumoti</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={des}
                            onChange={(e) => setDes(e.target.value)}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="Malumoti"
                        />
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="price" className="leading-7 text-sm text-gray-600">Narxi</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="Narxi"
                        />
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="image" className="leading-7 text-sm text-gray-600">Rasm URL</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                            className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="Rasm URL"
                        />
                    </div>
                </Modal>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Image</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Category</th>
                                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Description</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Price</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {car.map(item => (
                                    <tr key={item.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <img className="w-24 h-24 object-cover object-center" src={item.img} alt="content" />
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{item.category}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{item.description}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">${item.price}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <button className="border px-4 py-2 bg-red-500 text-white rounded-lg mr-2 hover:bg-red-600 focus:outline-none" onClick={() => handleDelete(item.id)}>Delete</button>
                                                <button className="border px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none" onClick={() => handleEdit(item.category, item.description, item.img, item.id, item.price)}>Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
