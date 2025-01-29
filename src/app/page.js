"use client"; 

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import GridMenu from "../components/GridMenu/GridMenu";
import "./page.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer/Footer";
import WhatsApp from "@/components/whatsappButton/whatsappButton";

const Home = () => {
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    const updateImages = () => {
      if (window.innerWidth <= 768) {
        // Imagens para mobile
        setBannerImages(["/banner4.png", "/banner5.png", "/banner6.png"]);
      } else {
        // Imagens para web
        setBannerImages(["/banner1.png", "/banner2.png", "/banner3.png"]);
      }
    };

    updateImages(); // Chama ao carregar a página
    window.addEventListener("resize", updateImages); // Atualiza ao redimensionar a janela

    return () => {
      window.removeEventListener("resize", updateImages); // Remove o listener ao desmontar
    };
  }, []);

  return (
    <div className="container">
      <div className="containerSlide">
        <Navbar />
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="mySwiper"
          alt="frete de caminhão em Teresópolis"
        >
          {bannerImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                className="imgBanner"
                src={image}
                alt={`Banner ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="containerForm">
        <h3>Escolha o serviço abaixo.</h3>
        <GridMenu />
      </div>
      <div className="containerFooter">
        <Footer />
        <WhatsApp/>
      </div>
      
    </div>
  );
};

export default Home;
