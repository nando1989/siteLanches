"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaSearch, FaWhatsapp, FaStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./page.css";
import Footer from "../components/Footer/Footer";
import WhatsApp from "@/components/whatsappButton/whatsappButton";
import Card from "@/components/Cards/cards";
import CartIcon from "@/components/CartIcon/cartIcon";

const Home = () => {
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    const updateImages = () => {
      if (window.innerWidth <= 768) {
     
        setBannerImages(["/banner7.avif", "/banner8.avif", "/banner9.avif", "/banner10.avif"]);
      } else {
       
        setBannerImages(["/banner1.avif", "/banner2.avif", "/banner3.avif"]);
      }
    };

    updateImages();
    window.addEventListener("resize", updateImages);

    return () => {
      window.removeEventListener("resize", updateImages);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [aberto, setAberto] = useState(true);

  useEffect(() => {
    const verificarHorario = () => {
      const agora = new Date();
      const hora = agora.getHours();
      const minutos = agora.getMinutes();

      const horaAtual = hora * 60 + minutos; 
      const horaAbertura = 11 * 60; 
      const horaFechamento = 24 * 60 + 30; 

      setAberto(horaAtual >= horaAbertura && horaAtual <= horaFechamento);
    };

    verificarHorario(); 
    const intervalo = setInterval(verificarHorario, 60000); 

    return () => clearInterval(intervalo); 
  }, []);

  return (
    <div className="container">
      <div className="containerSlide">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="mySwiper"
          alt="imagem lanche"
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
        <div className="containerTitleServices">
          <div className="containerOpen">
            <div className="containerHour">
              <div
                className="hour"
                style={{
                  color: "white",
                  backgroundColor: aberto ? "green" : "red",
                  padding: "5px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                {aberto ? "Aberto" : "Fechado para pedidos!"}
              </div>
            </div>
            <div className="containerbuttonAvaliation">avaliação!</div>
          </div>
          <div className="containerMin">
            <div><strong>Pedido minimo</strong>: R$20,00</div>
            <div className="containerStar">
              <FaStar className="faStar" />
              <div className="avaliation"><p>(4.7)</p></div>
            </div>
          </div>
          <div className="containerWhatsapp">
            <FaWhatsapp className="faWhatsapp" />
            <p>Whatsapp</p>
          </div>
          <div className="containerWellcome">
            Seja bem vindo(a) ao nosso site. Fique a vontade e faça seu pedido abaixo.
          </div>
          <div className="containerButtonInput">
            <div className="containerButtonMenu">
              <button onClick={() => scrollToSection("hamburguer")}>Hamburguer</button>
              <button onClick={() => scrollToSection("hotdog")}>Hotdog</button>
              <button onClick={() => scrollToSection("petiscos")}>Petiscos</button>
              <button onClick={() => scrollToSection("bebidas")}>Bebidas</button>
            </div>

          </div>
        </div>
      </div>

      {/* Seção Hamburguer */}
      <div id="hamburguer" className="imgFood">
        <div className="titleFood">
          <h2>Hamburguer</h2>
        </div>
        <img
          src="/hamburguer.png"
          alt="Caminhão de frete"
          className="imghamburguer"
        />
        <Card
          title="Burgão Saradão"
          description="Escolha seu hamburguer"
          price="25,00"
          imageUrl="/malibu6.png"
          composição="Pão, Carne, Molho especial, alface, Tomate e Milho"
          itens={["Burgão Saradão"]}
          hasCheckbox={true}
        />
        <Card
          title="BanconBurguer"
          description="Escolha seu hamburguer"
          price="25,00"
          imageUrl="/malibu9.png"
          composição="Pão, Carne, Molho especial, alface, Tomate e Milho"
          itens={["BanconBurguer"]}
          hasCheckbox={true}
        />
        <Card
          title="Chicken duplo"
          description="Escolha seu hamburguer"
          price="25,00"
          imageUrl="/malibumagnifico.png"
          composição="Pão, Carne, Molho especial, alface, Tomate e Milho"
          itens={["Chicken duplo"]}
          hasCheckbox={true}
        />
      </div>

      {/* Seção Hotdog */}
      <div id="hotdog" className="imgFood">
        <div className="titleFood">
          <h2>Hotdog</h2>
        </div>
        <img
          src="/hotdogImg.png"
          alt="Caminhão de frete"
          className="imghamburguer"
        />
        <Card
          title="Hot Dog Saradão"
          description="Escolha seu hot dog"
          price="10,00"
          imageUrl="/hot2.png"
          composição="Pão, Salsicha, Molho especial, Ovo de codorna, alface, Tomate, Milho e Ervilha"
          itens={["Hot dog saradão"]}
          hasCheckbox={true}
          checkboxLabels={{
            "Hot dog saradão": ["Molho especial R$ 3,00", "queijo Cheddar R$ 3,00"],
          }}
        />
        <Card
          title="Hot Dog Simples"
          description="Escolha seu hot dog"
          price="25,00"
          imageUrl="/hot1.png"
          composição="Pão, Salsicha, Molho especial, Ovo de codorna, alface, Tomate, Milho e Ervilha"
          itens={["Hot dog saradão"]}
          hasCheckbox={true}
          checkboxLabels={{
            "Hot dog saradão": ["Molho especial R$ 3,00", "queijo Cheddar R$ 3,00"],
          }}
        />
        <Card
          title="Hot Dog de linguiça"
          description="Escolha seu hot dog"
          price="25,00"
          imageUrl="/hot3.png"
          composição="Pão, Salsicha, Molho especial, Ovo de codorna, alface, Tomate, Milho e Ervilha"
          itens={["Hot dog saradão"]}
        />
      </div>

      {/* Seção Petiscos */}
      <div id="petiscos" className="imgFood">
        <div className="titleFood">
          <h2>Petiscos</h2>
        </div>
        <img
          src="/petiscoImg.png"
          alt="Caminhão de frete"
          className="imghamburguer"
        />
        <Card
          title="Caixa de petiscos"
          description="Serve 5 até pessoas"
          price="49,90"
          imageUrl="/pet1.png"
          composição="teste"
          itens={["Hot dog saradão"]}
          hasCheckbox={true}
          checkboxLabels={{
            "Hot dog saradão": ["Molho especial R$ 3,00", "queijo Cheddar R$ 3,00"],
          }}
        />
        <Card
          title="Isca de frango com anel de cebola"
          description="Serve até 2 pessoas"
          price="24,90"
          imageUrl="/pet2.png"
          composição="teste"
          itens={["Hot dog saradão"]}
          hasCheckbox={true}
          checkboxLabels={{
            "Hot dog saradão": ["Molho especial R$ 3,00", "queijo Cheddar R$ 3,00"],
          }}
        />
        <Card
          title="Batata frita com anel de cebola"
          description="Serve até 2 pessoas"
          price="24,90"
          imageUrl="/pet3.png"
          composição="teste"
          itens={["Hot dog saradão"]}
          hasCheckbox={true}
          checkboxLabels={{
            "Hot dog saradão": ["Molho especial R$ 3,00", "queijo Cheddar R$ 3,00"],
          }}
        />
      </div>

      {/* Seção Bebidas */}
      <div id="bebidas" className="imgFood">
        <div className="titleFood">
          <h2>Bebidas</h2>
        </div>
        <img
          src="/bebidas.png"
          alt="Caminhão de frete"
          className="imghamburguer"
        />
        <Card
          title="Guaravita"
          description="Copo com 300 ml"
          composição="Copo com 350 ml"
          price="3,00"
          imageUrl="/guaravita.png"
          itens={["guaravita"]}
          limiteMaximo={30}
          precoFixo={true}
        />
        <Card
          title="Coca-cola"
          description="Lata com 350 ml"
          composição="lata com 350 ml"
          price="7,00"
          imageUrl="/cocacola.png"
          itens={["Coca-cola"]}
          limiteMaximo={50}
          precoFixo={true}
        />
        <Card
          title="Suco de laranja"
          description="Copo com 250 ml"
          composição="Copo com 250 ml"
          price="5,00"
          imageUrl="/suco.png"
          itens={["Suco natural"]}
          limiteMaximo={100}
          precoFixo={true}
        />
      </div>

      <div className="containerFooter">
        <Footer />
        <WhatsApp />
      </div>

     
      <CartIcon />
    </div>
  );
};

export default Home;
