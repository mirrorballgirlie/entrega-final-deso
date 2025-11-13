import React, { type ReactNode } from "react";

type Rounded = "small" | "medium" | "pill";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /**
   * Tamaño del radio de borde. `pill` hace el botón completamente redondeado.
   */
  rounded?: Rounded;
}

export default function Button({ children, rounded = "medium", style, ...rest }: Props) {
  const radiusMap: Record<Rounded, string> = {
    small: "4px",
    medium: "8px",
    pill: "9999px",
  };

  const mergedStyle: React.CSSProperties = {
    padding: "10px 20px",
    background: "#2a4b8d",
    border: "none",
    color: "#FFFCF5",
    borderRadius: radiusMap[rounded],
    // Tipografía solicitada
    textAlign: "center",
    fontFamily: '"Myanmar Khyay", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
    cursor: "pointer",
    width: "179px",
    height: "50px",
    ...style,
  };

  return (
    <button {...rest} style={mergedStyle}>
      {children}
    </button>
  );
}
