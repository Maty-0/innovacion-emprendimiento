import './globals.css'; 

export const metadata = {
  title: 'Prototipo Plataforma Laboral',
  description: 'Prototipo Next.js + NestJS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}