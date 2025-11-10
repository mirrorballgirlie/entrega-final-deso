import React from "react";

interface Props {
  label: string;
  children: React.ReactNode;
}

export default function FormField({ label, children }: Props) {
  return (
    <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column" }}>
      <label style={{ fontWeight: "bold" }}>{label}</label>
      {children}
    </div>
  );
}