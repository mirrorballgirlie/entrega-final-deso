import React, { type ReactNode } from "react";

type Rounded = "small" | "medium" | "pill";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  rounded?: Rounded;
}

export default function Button({ children, rounded = "medium", style, ...rest }: Props) {
  const radiusMap: Record<Rounded, string> = {
    small: "4px",
    medium: "8px",
    pill: "9999px",
  };

  const mergedStyle: React.CSSProperties = {
    padding: "12px 20px",
    background: "#2a4b8d",
    border: "none",
    color: "#FFFCF5",
    borderRadius: radiusMap[rounded],
    textAlign: "center",
    fontFamily: '"Myanmar Khyay", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontSize: "22px",
    fontWeight: 400,
    cursor: "pointer",

    
    whiteSpace: "normal",

    
    minWidth: "150px",

  

    ...style,
  };

  return (
    <button {...rest} style={mergedStyle}>
      {children}
    </button>
  );
}
