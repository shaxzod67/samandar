import React from "react";
import { Link } from "react-router-dom";
import Banner from "./Banner";
import Footer from "./Footer";
import Home from "../Pages/home";
import { Carousel } from 'antd';

const contentStyle = {
  height: '800px',
  color: '#fff',
  lineHeight: '800px',
  textAlign: 'center',
  background: '#364d79',
};

function HeaderMain() {
  return (
    <>
      <div className="header_bac">
        <Carousel autoplay="10">
          <div className="slider_box">
            <img src="https://avatars.mds.yandex.net/i?id=35575c3ca96a5e15578d1391f502faaeb3d19c72-9222747-images-thumbs&n=13" alt="" style={contentStyle} />
          </div>
          <div className="slider_box">
            <img src="https://avatars.mds.yandex.net/i?id=15a62f31ca77ba71604e3358db73d6617288275e-10456573-images-thumbs&n=13" alt="" style={contentStyle} />
          </div>
          <div className="slider_box">
            <img src="https://avatars.mds.yandex.net/i?id=91651305d4ad35d54aa84bca32fb9389b2702597-4809712-images-thumbs&n=13" alt="" style={contentStyle} />
          </div>
          <div className="slider_box">
            <img src="https://avatars.mds.yandex.net/i?id=91fd03ef25b435b355c75bd576fd701c073ea5c102b78842-5498202-images-thumbs&n=13" alt="" style={contentStyle} />
          </div>
        </Carousel>
        <div className="header__main">
          <div className="header__box">
            <h1>Yuqori-Sifatli mahsulotlar siz uchun</h1>
            <p>Bizning mahsulotlarimiz yuqori sifatli barcha talablarga javob beruvchi va ishonchlidir</p>
            <Link to="/products">
              <button>Xarid Qilish</button>
            </Link>
          </div>
        </div>
      </div>

      <Banner />
      <Home />
      <div className="show">
        <Link to="/products">
          <button className="show-more">Ko'proq Ko'rish</button>
        </Link>
      </div>
      <Footer />
    </>
  );
}

export default HeaderMain;
