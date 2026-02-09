'use client';

import styles from "./formularioLogin.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";

type Props = {
  username: string;
  password: string;
  error?: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

export default function FormularioLogin({
  username,
  password,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  return (
       <div className={styles.home}>

    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
         <header className={styles.titleWrapper}>
            <Title>Inicar Sesion en Hotel Premier</Title>
          </header>

      <div className={styles.field}>
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Ingrese su nombre de usuario"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Ingrese su contraseña"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <Button type="submit" variant="contained">
        Aceptar
      </Button>
    </form>

    </div>
  );
}
