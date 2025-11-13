import React, { type ReactNode } from "react"; 

interface Props {
  //text: string;
  children: ReactNode;
  //variant: "primary" | "secondary" | "danger"
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function Button({ children, onClick, type = "button" }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: "#2a4b8d",
        border: "none",
        color: "white",
        borderRadius: "5px",
        fontWeight: "bold",
        cursor: "pointer",
        marginRight: "10px"
      }}
    >
      {children}
    </button>
  );
}
