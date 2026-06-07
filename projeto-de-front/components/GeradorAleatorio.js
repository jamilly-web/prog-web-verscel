"use client";

import { useState } from "react";

export default function GeradorAleatorio() {
  const [valor, setValor] = useState("- -");
  const handleClick = () => {
    const num = Math.floor(Math.random() * 100) + 1;
    setValor(num);
  };
  return (
    <>
      <h3>Número gerado: {valor}</h3>
      <button onClick={handleClick}>Gerar Aleatório</button>
    </>
  );
}
