
import "./globals.css";

export const metadata = {
  title: "Serra Frete",
  description: "Intermediação de serviços de frete.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
