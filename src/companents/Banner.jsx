import trophy from '../images/trophy 1.png'
import guarantee from '../images/guarantee.png'
import shipping from '../images/shipping.png'
import customer from '../images/customer-support.png'

function Banner() {
    return (
    <div>
        <div className="banner">
            <div className="banner__box">
                <img src={trophy} alt="" />
                <div className="banner__child">
                    <p><b>Yuqori Sifat</b></p>
                    <p>Yuqori sifatli va ishochli mahsulotlar</p>
                </div>
                
            </div>
            <div className="banner__box">
                <img src={guarantee} alt="" />
                <div className="banner__child">
                    <p><b>Kafolotli Homiya</b></p>
                    <p>2 yildan ortiq</p>
                </div>
            </div>
            <div className="banner__box">
                <img src={shipping} alt="" />
                <div className="banner__child">
                    <p><b>Yetkazib berish bepul</b></p>
                    <p>Jizzax viloyati bo'ylab</p>
                </div>
                
            </div>
            <div className="banner__box">
                <img src={customer} alt="" />
                <div className="banner__child">
                    <p><b>24/7 Qo'llab quvlatlash</b></p>
                    <p>Maxsus yordam</p>
                </div>
            </div>
        </div>
        <h1 className='our_products'>Mahsulotlar</h1>
    </div>
  )
}

export default Banner