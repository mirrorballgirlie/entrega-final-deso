"use client";
import styles from "./formularioBuscarResponsable.module.css";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import Title from "@/components/Title";

interface Props {
  form: {
    razonSocial: string;
    cuit: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function FormularioBuscarResponsable({
  form,
  onChange,
  onSubmit,
  onCancel,
}: Props) {


  return (
    <div className={styles.wrapper}>

      <header className={styles.titleWrapper}>
        <Title>Buscar Responsable de Pago</Title>
      </header>

      <main className={styles.mainContent}>
        <form className={styles.form} onSubmit={onSubmit}>

          <div className={styles.row}>
            <FormField label="Razón Social">
              <input
                name="razonSocial"
                value={form.razonSocial}
                onChange={onChange}
                placeholder="INGRESE RAZÓN SOCIAL..."
              />
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="CUIT">
              <input
                name="cuit"
                value={form.cuit}
                onChange={onChange}
                placeholder="INGRESE CUIT..."
              />
            </FormField>
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit">Siguiente</Button>
            <Button type="button" onClick={onCancel}>
              Cancelar
            </Button>
          </div>

        </form>
      </main>

    </div>
  );
}
