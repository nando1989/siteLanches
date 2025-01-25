"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


import GridMenu from '../components/GridMenu/GridMenu';
import './page.css';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer/Footer';

const Home = () => {
  return (
    <div className='container'>
      <div className='containerSlide'>
        <Navbar />
        <h1>O melhor e mais seguro de Teresópolis</h1>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              className="imgBanner"
              src="/truck1.png"
              alt="Caminhão 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="imgBanner"
              src="/truck2.png"
              alt="Caminhão 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="imgBanner"
              src="/truck3.png"
              alt="Caminhão 3"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="containerForm">
        <h3>Escolha o serviço abaixo.</h3>
        <GridMenu />
      </div>
      <div className="containerFooter">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
