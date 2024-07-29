import { FaLocationDot } from "react-icons/fa6";
import { BsTelephoneFill } from "react-icons/bs";
function Footer() {
    return (
    <div>
        <div className="footer">
            <div className="footer_box1">
                <h1>Sunnat</h1> <br />
                <p>2024-yildan buyon Butun O'zbekiston bo'ylab faoliyat yuritamiz Biz web saytimizda 1000 dan ortiq sifatli mahsulotlarni sotamiz</p> <br />
                <p className="p"><FaLocationDot />  O'zbekiston Jizzax</p> <br />
                <p className="p"><BsTelephoneFill />  +998 97 643 0205</p>
                <a href="">www.sunnat.uz</a>
            </div>
            <div className="footer_box">
                <h1>Menu</h1> <br />
                <p>Products</p> <br />
                <p>Rooms</p> <br />
                <p>About Us</p>
            </div>
            <div className="footer_box">
                <h1>Account</h1> <br />
                <p>My Cart</p> <br />
                <p>My catalog</p>
            </div>
            <div className="footer_box">
                <h1>Aloqada Qoling</h1> <br />
                <a href="">Instagram</a> <br /><br />
                <a href="">Telegram</a> <br /><br />
                <a href="">Facebook</a>
            </div>
            <div className="footer_box">
                <h1>Yangilanib turing</h1><br />
                <input type="email" placeholder="Sizning email pochtangiz"/>
                <button>Yuborish</button>
            </div>
        </div>
    </div>
    )
}

export default Footer