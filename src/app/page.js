"use client"
import GridMenu from '@/components/GridMenu/GridMenu';
import './page.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer/Footer';

const Home = () => {


  return (
    <div className='container'>
      <div className='containerSlide'>
        <Navbar/>
        <h1> O melhor e mais seguro de Teresópolis</h1>
        < img
          className='imgBanner'
          src="/truck.png"
          alt="Logo da empresa"

        />
      </div>
      <div className="containerForm">
        <h3>Escolha o serviço abaixo.</h3>
        <GridMenu />
      </div>
      <div className="containerFooter">
        <Footer/>
      </div>
    </div>
  );
};

export default Home;

