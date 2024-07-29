import './App.css';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { SignIn } from './Pages/SignIn';
import Dashboard from './Pages/Dashboard';
import { useContext, useState, useEffect } from 'react';
import { ProtectRouteAdmin } from './Protect/ProtectRoutesAdmin';
import { AuthContext } from './context/AuthContext';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from 'react-use-cart';
import Cart from './context/Cart';
import Zakazlar from './Pages/Zakazlar';
import Heart from './Pages/heart';
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import HeaderMain from './companents/HeaderMain';
import Product from './companents/Product';
import { IoMdMenu } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import SignUp from './Pages/SignUp';

function App() {
  const { currentUser } = useContext(AuthContext);
  const [count, setCount] = useState(0);

  useEffect(() => {

    const cartItems = JSON.parse(localStorage.getItem('react-use-cart')) || [];
    const cardsLength = cartItems.items
    setCount(cardsLength.length);
  }, []);

  const LogOut = () => {
    localStorage.removeItem('user');
    <Navigate to={'/'} />
  }

  return (
    <BrowserRouter>
      <header>
        <nav>
          <input type="checkbox" id="check" />
          <label htmlFor="check" className="checkboxbtn">
            <IoMdMenu />
          </label>

          <div className="navigation">
            <div className="logo">
              <h1>Sunnat</h1>
            </div>

            <ul className="menu2">
              <div className="nav1">
                <li className="home">
                  <NavLink to="/">Home</NavLink>
                </li>
                <li className="home">
                  <NavLink to="/products">Mahsulotlar</NavLink>
                </li>
                {currentUser && (
                  <li>
                    <NavLink to="/dashboard">Mahsulot Qo'shish</NavLink>
                  </li>
                )}
                {currentUser && (
                  <li>
                    <NavLink to="/zakazlar">Zakazlar</NavLink>
                  </li>
                )}
              </div>

              <div className="nav2">
                <li>
                  <NavLink to="/heart">
                    <FaRegHeart className="user" />
                  </NavLink>
                </li>
                <li className='relative'>
                  <small className="son text-white absolute text-[12px] ml-[7%] font-bold mt-[-15%] mt-[-12px] bg-orange-500">
                    {count}
                  </small>
                  <NavLink to="/cart">
                    <AiOutlineShoppingCart className="user" />
                  </NavLink>
                </li>
                <li className="pt-2">
                  <NavLink to="/signin">
                    <FaRegUser className="user" />
                  </NavLink>
                </li>
                {currentUser && (
                  <li onClick={LogOut}>
                    <MdLogout />
                  </li>
                )}
              </div>
            </ul>
          </div>
        </nav>
      </header>

      <CartProvider>
        <Routes>
          <Route element={<HeaderMain />} path="/" />
          <Route element={<Product />} path="/products" />
          <Route element={<SignIn />} path="/signin" />
          <Route element={<Cart />} path="/cart" />
          <Route element={<Heart />} path="/heart" />
          <Route element={<ProtectRouteAdmin>{currentUser ? <Zakazlar /> : <Navigate to="/signin" />}</ProtectRouteAdmin>} path="/zakazlar" />
          <Route element={<ProtectRouteAdmin>{currentUser ? <Dashboard /> : <Navigate to="/signin" />}</ProtectRouteAdmin>} path="/dashboard" />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
