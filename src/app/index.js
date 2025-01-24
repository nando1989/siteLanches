import GridMenu from "../components/GridMenu/GridMenu";
import Navbar from "../components/navbar/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <section className="grid-section">
          <h1>Escolha o tipo de veículo para o frete</h1>
          <GridMenu />
        </section>
      </main>
    </div>
  );
}
