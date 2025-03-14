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
        // Imagens para mobile
        setBannerImages(["/banner7.png", "/banner8.png", "/banner9.png", "/banner10.png"]);
      } else {
        // Imagens para web
        setBannerImages(["/banner1.png", "/banner2.png", "/banner3.png"]);
      }
    };

    updateImages();
    window.addEventListener("resize", updateImages);

    return () => {
      window.removeEventListener("resize", updateImages);
    };
  }, []);

  // Função para scroll suave
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

      const horaAtual = hora * 60 + minutos; // Converte para minutos totais
      const horaAbertura = 11 * 60; // 11:00 em minutos
      const horaFechamento = 24 * 60 + 30; // 22:30 em minutos

      setAberto(horaAtual >= horaAbertura && horaAtual <= horaFechamento);
    };

    verificarHorario(); // Chama ao montar o componente
    const intervalo = setInterval(verificarHorario, 60000); // Atualiza a cada minuto

    return () => clearInterval(intervalo); // Limpa o intervalo ao desmontar
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
            Seja bem vindo(a) ao nosso site. Fique a vontade e faça seu pedido abaixo
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
          title="Hot Dog Saradão"
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
          title="Hot Dog Saradão"
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
          title="Hot Dog Saradão"
          description="Escolha seus Salgadinhos"
          price="25,00"
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
          description="Escolha seus Salgadinhos"
          price="25,00"
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
          description="Escolha seus Salgadinhos"
          price="25,00"
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
          title="Guaravita 300ml"
          description="Escolha seus Salgadinhos"
          price="3,00"
          imageUrl="/guaravita.png"
          itens={["guaravita"]}
          limiteMaximo={30}
          precoFixo={true}
        />
        <Card
          title="50 Salgadinhos"
          description="Escolha seus Salgadinhos"
          composição="Mínimo de 50 peças"
          price="50,00"
          imageUrl="/salgado02.png"
          itens={["Coxinha", "Risole", "Kibe", "Bolinha de queijo", "risole", "salsicha"]}
          limiteMaximo={50}
          precoFixo={true}
        />
        <Card
          title="100 Salgadinhos"
          description="Escolha seus Salgadinhos"
          composição="Mínimo de 100 peças"
          price="75,00"
          imageUrl="/salgado03.png"
          itens={["Coxinha", "Risole", "Kibe", "Bolinha de queijo", "risole", "salsicha"]}
          limiteMaximo={100}
          precoFixo={true}
        />
      </div>

      <div className="containerFooter">
        <Footer />
        <WhatsApp />
      </div>

      {/* CartIcon como ícone flutuante */}
      <CartIcon />
    </div>
  );
};

export default Home;