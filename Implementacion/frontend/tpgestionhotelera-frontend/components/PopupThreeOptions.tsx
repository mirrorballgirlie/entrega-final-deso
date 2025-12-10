// components/PopupThreeOptions.tsx
"use client";

import React from "react";
import Button from "./Button";

interface Props {
  message: string;
  option1Text: string;
  option2Text: string;
  option3Text: string;
  onOption1: () => void;
  onOption2: () => void;
  onOption3: () => void;
}

export default function PopupThreeOptions({
  message,
  option1Text,
  option2Text,
  option3Text,
  onOption1,
  onOption2,
  onOption3
}: Props) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
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
        height: "420px",
        textAlign: "center"
      }}>
        <header style={{
          background: "#374375",
          color: "#FFFCF5",
          fontFamily: "Mate SC",
          fontSize: "48px",
          padding: "10px 0"
        }}>
          <h1>Hotel Premier</h1>
        </header>

        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "3rem"
        }}>
          <p style={{
            color: "#000",
            fontFamily: "Open Sans",
            fontSize: "32px"
          }}>
            {message}
          </p>
        </div>

        <div style={{
          padding: "1.5rem 3rem",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <Button onClick={onOption1}>{option1Text}</Button>
          <Button onClick={onOption2}>{option2Text}</Button>
          <Button onClick={onOption3}>{option3Text}</Button>
        </div>
      </main>
    </div>
  );
}
