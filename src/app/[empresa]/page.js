"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaWhatsapp, FaStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./page.css";

import Footer from "@/components/Footer/Footer";
import WhatsApp from "@/components/whatsappButton/whatsappButton";
import Card from "@/components/Cards/cards";
import CartIcon from "@/components/CartIcon/cartIcon";

import { getDatabase, ref, get } from "firebase/database";
import CartModal from "@/components/CartModal/cartModal";

const Home = () => {
  const params = useParams();
  const empresa = params.empresa; 
  const pathname = usePathname();
  const nomeLanchonete = pathname.split("/")[1]; // ou [2], depende da estrutura

  const [bannerImages, setBannerImages] = useState([]);
  const [sections, setSections] = useState({
    section1: [],
    section2: [],
    section3: []
  });

  const [info, setInfo] = useState({});
  const [aberto, setAberto] = useState(true);

  const fetchSections = async () => {
    try {
      const db = getDatabase();
      const sectionsData = {};

      for (const section of ["section1", "section2", "section3", "info"]) {
        const sectionRef = ref(db, `${empresa}/${section}`);
        const snapshot = await get(sectionRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          sectionsData[section] = section === "info"
            ? data
            : Object.keys(data).map(key => ({
                id: key,
                ...data[key],
              }));
        } else {
          sectionsData[section] = section === "info" ? {} : [];
        }
      }

      setSections(sectionsData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchSections();

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
  }, [empresa]);

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
            <div className="hour" style={{
              color: "white",
              backgroundColor: aberto ? "green" : "red",
              padding: "5px",
              borderRadius: "5px",
              fontWeight: "bold",
            }}>
              {aberto ? "Aberto" : "Fechado para pedidos!"}
            </div>
          </div>

          <div className="containerMin">
            <div><strong>Pedido mínimo</strong>: R$20,00</div>
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
              <button onClick={() => scrollToSection("section1")}>Sanduíches</button>
              <button onClick={() => scrollToSection("section2")}>Hotdog</button>
              <button onClick={() => scrollToSection("section3")}>Bebidas</button>
            </div>
          </div>
        </div>
      </div>

      {["section1", "section2", "section3"].map((sec, idx) => (
        <div key={sec} id={sec} className="imgFood">
          <div className="titleFood">
            <h2><strong>{["Sanduíches", "Hotdog", "Bebidas"][idx]}</strong></h2>
          </div>
          {sections[sec]?.map(produto => (
            <Card
              key={produto.id}
              title={produto.name || "Sem nome"}
              description={produto.description || ""}
              price={produto.price || "0,00"}
              imageUrl={produto.imageUrl || "/semImg.png"}
              composition={produto.composition || ""}
              itens={[sec]}
              hasCheckbox={true}
            />
          ))}
        </div>
      ))}

      <div className="containerFooter">
          <Footer nomeLanchonete={nomeLanchonete} />
        <WhatsApp />
      </div>

      <CartIcon loja={empresa} />


    </div>
  );
};

export default Home;
