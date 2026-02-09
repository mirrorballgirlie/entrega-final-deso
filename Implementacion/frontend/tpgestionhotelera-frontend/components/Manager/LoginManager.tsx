"use client";

import { useState } from "react";
import FormularioLogin from "@/components/Formularios/FormularioLogin";
import Title from "@/components/Title";

type Props = {
  onLoginExitoso: () => void;
};

export default function LoginManager({ onLoginExitoso }: Props) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // mock
  const credencialesMock = {
    usuario: "admin",
    password: "1234",
  };

  const handleLogin = () => {
    if (usuario === credencialesMock.usuario && password === credencialesMock.password) {
      onLoginExitoso(); //
    } else {
      setError("El usuario o la contraseña no son válidos");
      setUsuario("");
      setPassword("");
    }
  };

  return (
    <div style={{ padding: "24px" }}>

      <Title text="Iniciar sesión" />

      <FormularioLogin
        username={usuario}
        password={password}
        onUsernameChange={setUsuario}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        error={error}
      />
    </div>
  );
}
