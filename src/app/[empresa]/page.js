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
import { getDatabase, ref, get, child } from "firebase/database";

const Home = () => {
  const params = useParams();
  const empresa = params.empresa;
  const pathname = usePathname();
  const nomeLanchonete = pathname.split("/")[1]; // ou [2], depende da estrutura

  const [bannerImages, setBannerImages] = useState([]);
  const [sections, setSections] = useState({});


  const [info, setInfo] = useState({});
  const [aberto, setAberto] = useState(true);

  const fetchSections = async () => {
    try {
      const db = getDatabase();
      const sectionsData = {};

      // Busca todos os dados da empresa
      const empresaRef = ref(db, empresa);
      const snapshot = await get(empresaRef);

      if (snapshot.exists()) {
        const allData = snapshot.val();

        // Filtra apenas as sections que começam com 'section' e são numéricas
        const sectionKeys = Object.keys(allData).filter(key =>
          key.startsWith('section') && !isNaN(key.replace('section', ''))
        );

        // Processa cada section encontrada
        for (const sectionKey of sectionKeys) {
          const sectionContent = allData[sectionKey];

          // Filtra os itens (ignorando o campo 'name' se existir)
          const items = Object.keys(sectionContent)
            .filter(key => key !== 'name')
            .map(key => ({
              id: key,
              ...sectionContent[key]
            }));

          sectionsData[sectionKey] = {
            name: sectionContent.name || '', // Salva o nome da seção separadamente
            items: items
          };
        }

        // Adiciona outras seções importantes (info, categories, pedidos)
        if (allData.info) sectionsData.info = allData.info;
        if (allData.categories) sectionsData.categories = allData.categories;
        if (allData.pedidos) sectionsData.pedidos = allData.pedidos;

        setSections(sectionsData);
        console.log("Dados processados:", sectionsData); // Verifique esta saída
      }
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

  async function buscarCategorias(lojaSlug) {
    try {
      const dbRef = ref(getDatabase());
      const categoriesRef = child(dbRef, `${lojaSlug}/categories`);  // Usando lojaSlug aqui
      const snapshot = await get(categoriesRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        // Filtra todas as seções e mapeia para o formato esperado
        const categorias = Object.keys(data)
          .filter(key => key.startsWith('section'))  // Pegando todas as seções
          .map((sectionKey) => ({
            id: sectionKey,
            name: data[sectionKey]?.name || `Seção ${sectionKey.replace('section', '')}`
          }));

        return categorias;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  }



  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (empresa) {
      buscarCategorias(empresa)
        .then(setCategorias)
        .catch(error => {
          console.error("Erro ao carregar categorias:", error);
          setCategorias([]);
        });
    }
  }, [empresa]);



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

          <div className="containerButtonMenu">
            {Array.isArray(categorias) && categorias.length > 0 ? (
              categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSection(cat.id)}
                >
                  {cat.name}
                </button>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma categoria disponível</p>
            )}
          </div>
        </div>
      </div>

      {categorias.map((cat) => (
  <div key={cat.id} id={cat.id} className="imgFood">
    <div className="titleFood">
      <h2><strong>{cat.name}</strong></h2>
    </div>
    {Object.keys(sections.categories?.[cat.id] || {})
      .filter(produtoId => !isNaN(produtoId)) // Filtra apenas IDs numéricos
      .map((produtoId) => {
        const produto = sections.categories[cat.id][produtoId];
        return (
          <Card
            key={produtoId}
            title={produto?.name || "Sem nome"}
            description={produto?.description || ""}
            price={produto?.price || "0,00"}
            imageUrl={produto?.imageUrl || "/semImg.png"}
            composition={produto?.composition || ""}
            itens={[cat.id]}
            hasCheckbox={true}
          />
        );
      })}
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
