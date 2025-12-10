import React from 'react';
import style from './layout.module.css';
import Title from '@/components/Title';

export default function GrillaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div >
      <header className={style.header}>
        <Title>Reservar habitación</Title>
      </header>

      {children}
    </div>
  )
}