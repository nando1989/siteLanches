import Navbar from "../../components/navbar/Navbar";

export default function Invoice() {
  return (
    <div>
      <Navbar />
      <main className="invoice-page">
        <h2>Nota Fiscal</h2>
        <form>
          {/* Campos do formulário de nota */}
          <input type="text" placeholder="Número da Nota" />
          <input type="text" placeholder="Descrição do Serviço" />
          <input type="number" placeholder="Valor Total" />
          <button type="submit">Gerar Nota Fiscal</button>
        </form>
      </main>
    </div>
  );
}
