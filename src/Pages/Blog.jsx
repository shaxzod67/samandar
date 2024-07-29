import { db } from "../firebase";
import { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { notification } from 'antd';

const Blog = () => {
  const [blog, setBlog] = useState([]);
  const [title, setTitle] = useState('');
  const [descript, setDescript] = useState('');
  const [img, setImg] = useState('');
  const [show, setShow] = useState(true);
  const [id, setId] = useState('');

  useEffect(() => {
    const dataBase = collection(db, 'blogs');

    const unsubscribe = onSnapshot(dataBase, (snapshot) => {
      const malumot = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setBlog(malumot);
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (title === "" || descript === "" || img === "") {
      return notification.error({
        message: "Input bo'sh",
        description: "Iltimos ma'lumotlarni to'liq kiriting.",
      });
    } else {
      await addDoc(collection(db, 'blogs'), {
        title: title,
        descript: descript,
        img: img,
        id: uuidv4(),
      });

      notification.success({
        message: "Ma'lumotlar yuborildi",
        description: "Bir doim xizmatingizdamiz taxsir",
      });

      setTitle("");
      setDescript("");
      setImg("");
    }
  };

  const handleDelete = async (id) => {
    const deletePost = doc(db, 'blogs', id);
    await deleteDoc(deletePost);
  };

  const handleEdit = (id, title, descript, img) => {
    setId(id);
    setTitle(title);
    setDescript(descript);
    setImg(img);
    setShow(false);
  };

  const handleUpdate = async () => {
    const updateData = doc(db, 'blogs', id);
    await updateDoc(updateData, { title, descript, img });
    setShow(true);
    setId("");
    setTitle("");
    setDescript("");
    setImg("");
  };

  return (
    <div className="container mx-auto p-4">
      <header className="bg-blue-900 text-white py-5 mb-8">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4H8v-2h4V7l4 4-4 4z" />
            </svg>
            <h1 className="text-3xl font-bold">Car Blog</h1>
          </div>
          <nav className="space-x-4">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      {/* <h2 className="text-2xl font-bold text-center mb-8">Old Cars</h2> */}

      <div className="mb-8 flex flex-wrap justify-center">
        <label className="flex flex-col items-center mx-2 mb-4">
          <span className="text-gray-700 mb-1">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full md:w-64 rounded-md border-gray-300 shadow-sm border-2 p-2" />
        </label>
        <label className="flex flex-col items-center mx-2 mb-4">
          <span className="text-gray-700 mb-1">Description</span>
          <input value={descript} onChange={(e) => setDescript(e.target.value)} type="text" className="w-full md:w-64 rounded-md border-gray-300 shadow-sm border-2 p-2" />
        </label>
        <label className="flex flex-col items-center mx-2 mb-4">
          <span className="text-gray-700 mb-1">Img</span>
          <input value={img} onChange={(e) => setImg(e.target.value)} type="text" className="w-full md:w-64 rounded-md border-gray-300 shadow-sm border-2 p-2" />
        </label>
      </div>

      <div className="flex justify-center">
        {show ? (
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleCreate}>Create</button>
        ) : (
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleUpdate}>Update</button>
        )}
      </div>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {blog.map(data => (
              <div key={data.id} className="p-4 md:w-1/2 lg:w-1/3 w-full">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                  <img src={data.img} alt="blog" className="lg:h-48 md:h-36 w-full object-cover object-center" />
                  <div className="p-6">
                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">{data.title}</h2>
                    <p className="leading-relaxed mb-3">{data.descript}</p>
                    <div className="flex items-center flex-wrap">
                      <button className="border px-4 py-2 mr-2 bg-blue-600 text-center text-white rounded-md hover:bg-blue-700" onClick={() => handleEdit(data.id, data.title, data.descript, data.img)}>Update</button>
                      <button className="border px-4 py-2 bg-red-600 text-center text-white rounded-md hover:bg-red-700" onClick={() => handleDelete(data.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
