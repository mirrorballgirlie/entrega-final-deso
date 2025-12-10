// components/Title.tsx
import React from 'react';
// 1. Importamos la fuente optimizada de Next.js
import { Libre_Baskerville } from 'next/font/google';

// 2. Configuramos la fuente
const libreBaskerville = Libre_Baskerville({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

// 3. Definimos los estilos en un objeto (traduciendo CSS a JS)
const titleStyle: React.CSSProperties = {
  color: '#000',
  fontSize: '70px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'normal',
  // Nota: No definimos fontFamily aquí porque la inyectará la función de Next.js
};

interface TitleProps {
  children: React.ReactNode;
}

export default function Title({ children }: TitleProps) {
  return (
    <h1 
      // 4. Aplicamos la clase de la fuente Y nuestros estilos personalizados
      className={libreBaskerville.className} 
      style={titleStyle}
    >
      {children}
    </h1>
  );
}