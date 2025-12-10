import React from "react";
import Button from "./Button";

interface Props {
  // title: string;
  message: string;
  primaryText: string;    
  secondaryText: string;
  onPrimary: () => void;  
  onSecondary: () => void;
  
  //onAccept: () => void;
  //onCancel: () => void;
}

export default function PopupCritical({ message, primaryText, secondaryText, onPrimary, onSecondary }: Props) {
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
     
      <main style={{
        background: "white",
        
        borderRadius: "10px",
        width: "1024px",
        height: "375px",
        textAlign: "center"
      }}>
        <header style={{
          // display: "flex",
          width: "auto",
          height: "auto",
          flexShrink: 0,
          background: "#374375",
          color: "#FFFCF5",
          fontFamily: "Mate SC",
          fontSize: "48px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal"
          }}>
            
        <h1 >Hotel Premier</h1>    
      </header>
      <div style={{
          display: "flex",          
          justifyContent: "center",
          alignItems: "center",
          padding: "5rem",
          // width: "auto",
          // height: "200px",
      }}> 
        <p style={{
          color: "#000",
          fontFamily: "Open Sans",
          fontSize: "32px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          
      
        }}>{message}</p>
      </div>
        
        <div style={{
          padding: "2rem",
          display:"flex",
          justifyContent:"space-between",
          alignContent:"flex-end",
          // width: "auto",
          // height: "auto",
          
        }}>
          <Button onClick={onPrimary} >{primaryText}</Button>
          <Button onClick={onSecondary}>{secondaryText}</Button >
        </div>
        
      </main>
    </div>
  );
}

