import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

type Props = {
  onLogout: () => void;
};

export default function Home({ onLogout }: Props) {
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1 className={styles.h1}>Navegación</h1>
        <nav className={styles.navbar}>
          <Link href="/alta-huesped">Alta Huésped</Link>
          <Link href="/buscar-huesped">Buscar Huésped</Link>
          <Link href="/estado-habitaciones2">Realizar Reserva</Link>
          <Link href="/ocupar-habitacion">Ocupar Habitación</Link>
          <Link href="/cancelar-reserva">Cancelar Reserva</Link>
          <Link href="/facturar-checkout">Facturar Checkout</Link>

          <button
            onClick={onLogout}
            style={{
              background: "none",
              cursor: "pointer",
              color: "inherit",
              font: "inherit",
              marginLeft: "16px",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            Cerrar sesión
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Bienvenido al Sistema de Gestión Hotelera</h2>
        <p className={styles.subtitle}>Seleccione una de las secciones para comenzar.</p>
      </main>
    </div>
  );
}
