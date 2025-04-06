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

  const [info, setInfo] = useState({});

  const [aberto, setAberto] = useState(true);

  // Busca dados das seções (listas)
  const fetchSections = async () => {
    try {
      const db = getDatabase();
      const sectionsData = {};
  
      for (const section of ['section1', 'section2', 'section3', 'info']) {
        const sectionRef = ref(db, section);
        const snapshot = await get(sectionRef);
  
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Se for a seção "info", salva como objeto normal
          sectionsData[section] = section === "info" ? data : Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
        } else {
          sectionsData[section] = section === "info" ? {} : [];
        }
      }
  
      setSections(sectionsData);
    } catch (error) {
      console.error("Erro ao buscar seções:", error);
    }
  };
  

  // Busca dados da seção 'info'
  const fetchInfo = async () => {
    try {
      const db = getDatabase();
      const infoRef = ref(db, 'info');
      const snapshot = await get(infoRef);

      if (snapshot.exists()) {
        setInfo(snapshot.val());
      } else {
        console.log("Nenhuma informação encontrada em 'info'");
      }
    } catch (error) {
      console.error("Erro ao buscar info:", error);
    }
  };

  // Carregar tudo ao iniciar



  useEffect(() => {
    fetchSections();
    fetchInfo();

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


  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

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
        >
          {bannerImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img className="imgBanner" src={image} alt={`Banner ${index + 1}`} />
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
            {sections.info?.apresentacaoTopoSite || "Sem apresentação"}
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
            composition={produto.composition || ""}
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
            composition={produto.composition || ""}
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
            composition={produto.composition || ""}
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