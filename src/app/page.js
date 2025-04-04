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
import { database } from "../../firebaseConfig";
import { getDatabase, ref, get } from "firebase/database";

const Home = () => {
  const [bannerImages, setBannerImages] = useState([]);
  const [sections, setSections] = useState({
    section1: [],
    section2: [],
    section3: []
  });
  const [aberto, setAberto] = useState(true);

  // Função para buscar produtos de todas as seções
  const fetchSections = async () => {
    try {
      const db = getDatabase();
      const sectionsData = {};
      
      // Busca dados para cada seção
      for (const section of ['section1', 'section2', 'section3']) {
        const sectionRef = ref(db, section);
        const snapshot = await get(sectionRef);
        
        if (snapshot.exists()) {
          sectionsData[section] = Object.keys(snapshot.val()).map(key => ({
            id: key,
            ...snapshot.val()[key]
          }));
        } else {
          sectionsData[section] = [];
        }
      }
      
      setSections(sectionsData);
    } catch (error) {
      console.error("Erro ao buscar seções:", error);
    }
  };

  useEffect(() => {
    fetchSections();
    
    // Código para banners responsivos (mantido do original)
    const updateImages = () => {
      setBannerImages(
        window.innerWidth <= 768
          ? ["/banner7.avif", "/banner8.avif", "/banner9.avif", "/banner10.avif"]
          : ["/banner1.avif", "/banner2.avif", "/banner3.avif"]
      );
    };
    
    updateImages();
    window.addEventListener("resize", updateImages);
    return () => window.removeEventListener("resize", updateImages);
  }, []);

  // Verificação de horário comercial (mantido do original)
  useEffect(() => {
    const verificarHorario = () => {
      const agora = new Date();
      const horaAtual = agora.getHours() * 60 + agora.getMinutes();
      setAberto(horaAtual >= 660 && horaAtual <= 1470); // 11:00 às 00:30
    };
    
    verificarHorario();
    const intervalo = setInterval(verificarHorario, 60000);
    return () => clearInterval(intervalo);
  }, []);

  // Função para rolagem suave (mantido do original)
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container">
      {/* Banner Swiper */}
      <div className="containerSlide">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="mySwiper"
        >
          {bannerImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img className="imgBanner" src={image} alt={`Banner ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Cabeçalho com informações */}
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
              <button onClick={() => scrollToSection("section1")}>Sanduiches</button>
              <button onClick={() => scrollToSection("section2")}>Hotdog</button>
              <button onClick={() => scrollToSection("section3")}>Bebidas</button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 1 */}
      <div id="section1" className="imgFood">
        <div className="titleFood">
          <h2><strong>Sanduiches</strong></h2>
        </div>
        {sections.section1.map(produto => (
          <Card
            key={produto.id}
            title={produto.name || "Sem nome"}
            description={produto.description || ""}
            price={produto.price || "0,00"}
            imageUrl={produto.imageUrl || "/semImg.png"}
            composição={produto.composition || ""}
            itens={["section1"]}
            hasCheckbox={true}
          />
        ))}
      </div>

      {/* Seção 2 */}
      <div id="section2" className="imgFood">
        <div className="titleFood">
          <h2><strong>Hotdog</strong></h2>
        </div>
        {sections.section2.map(produto => (
          <Card
            key={produto.id}
            title={produto.name || "Sem nome"}
            description={produto.description || ""}
            price={produto.price || "0,00"}
            imageUrl={produto.imageUrl || "/semImg.png"}
            composição={produto.composition || ""}
            itens={["section2"]}
            hasCheckbox={true}
          />
        ))}
      </div>

      {/* Seção 3 */}
      <div id="section3" className="imgFood">
        <div className="titleFood">
          <h2><strong>Bebidas</strong></h2>
        </div>
        {sections.section3.map(produto => (
          <Card
            key={produto.id}
            title={produto.name || "Sem nome"}
            description={produto.description || ""}
            price={produto.price || "0,00"}
            imageUrl={produto.imageUrl || "/semImg.png"}
            composição={produto.composition || ""}
            itens={["section3"]}
            hasCheckbox={true}
          />
        ))}
      </div>

      {/* Rodapé */}
      <div className="containerFooter">
        <Footer />
        <WhatsApp />
      </div>

      <CartIcon />
    </div>
  );
};

export default Home;