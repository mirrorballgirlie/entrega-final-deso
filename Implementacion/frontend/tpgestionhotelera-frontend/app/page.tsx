import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Navegación</h1>
        <nav className={styles.navbar}>
          {/* <Link href="/huesped">Huéspedes</Link>
          <Link href="/reservas">Reservas</Link>
          <Link href="/habitaciones">Habitaciones</Link>
          <Link href="/facturacion">Facturación</Link> */}
          <Link href="/alta-huesped">Alta Huésped</Link>
          <Link href="/buscar-huesped">Buscar Huésped</Link>
          <Link href="/estado-habitaciones2">Realizar Reserva</Link>
          <Link href="/ocupar-habitacion">Ocupar Habitación</Link>
          
        </nav>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Bienvenido al Sistema de Gestión Hotelera</h2>
        <p className={styles.subtitle}>Seleccione una de las secciones para comenzar.</p>
      </main>
    </div>

  );
}
