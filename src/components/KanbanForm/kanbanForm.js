import { useState } from 'react';
import './style.css';

const KanbanForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    lanche: '',
    nome: '',
    telefone: '',
    endereco: '',
    pagamento: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      lanche: '',
      nome: '',
      telefone: '',
      endereco: '',
      pagamento: '',
    });
  };

  return (
    <form className='form' onSubmit={handleSubmit} >
      <h3>Novo Pedido</h3>
      <input
        type="text"
        name="lanche"
        placeholder="Nome do Lanche"
        value={formData.lanche}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="nome"
        placeholder="Nome do Cliente"
        value={formData.nome}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="telefone"
        placeholder="Telefone"
        value={formData.telefone}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="endereco"
        placeholder="Endereço"
        value={formData.endereco}
        onChange={handleChange}
        required
      />
      <select
        name="pagamento"
        value={formData.pagamento}
        onChange={handleChange}
        required
      >
        <option value="">Forma de Pagamento</option>
        <option value="Dinheiro">Dinheiro</option>
        <option value="Cartão">Cartão</option>
        <option value="Pix">Pix</option>
      </select>
      <button type="submit">Adicionar Pedido</button>
    </form>
  );
};

export default KanbanForm;