
import { CartProvider } from '../../src/context/CartContext'; // Importe o CartProvider
import './globals.css';

export const metadata = {
  title: "Site mestre",
  description: "Lanchonete.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Envolva o children com o CartProvider */}
        <CartProvider>
          <main>{children}</main>
         
        </CartProvider>
      </body>
    </html>
  );
}