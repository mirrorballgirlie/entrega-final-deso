import React from "react";

interface Props {
  title: string;
  message: string;
  primaryText: string;    
  secondaryText: string;
  onPrimary: () => void;  
  onSecondary: () => void;
  
  //onAccept: () => void;
  //onCancel: () => void;
}

export default function PopupCritical({ title, message, primaryText, secondaryText, onPrimary, onSecondary }: Props) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "white",
        padding: "2rem",
        borderRadius: "10px",
        width: "400px",
        textAlign: "center"
      }}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onPrimary} style={{ marginRight: "10px" }}>{primaryText}</button>
        <button onClick={onSecondary}>{secondaryText}</button>
      </div>
    </div>
  );
}
