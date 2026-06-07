"use client";

import { requestPasswordReset } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStorage } from "@/zustand";
// 1. Importando o arquivo de estilos
import styles from "./page.module.css"; 

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  
  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      console.log("user data received from back4app:", data);
      alert("Verifique o seu e-mail para resetar a sua senha.");
      router.replace("/");
    },
    onError: (error) => {
      alert("Erro de Esqueci a minha senha. Erro: " + error.message);
    },
  });

  const handleChange = (evt) => {
    setEmail(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!email) {
      alert("Preencha o seu e-mail.");
      return;
    }
    mutation.mutate(email);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Password Reset</h1>
        <p className={styles.description}>
          Insira o seu e-mail abaixo para receber as instruções de recuperação.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">E-mail</label>
            <input 
              id="email"
              name="email" 
              type="email"
              placeholder="seu@email.com"
              value={email} 
              onChange={handleChange} 
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.buttonSubmit}
              disabled={mutation.isPending} // Desabilita o botão enquanto envia
            >
              {mutation.isPending ? "Enviando..." : "Enviar"}
            </button>
            
            <button 
              type="button" 
              className={styles.buttonCancel} 
              onClick={() => router.replace("/")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
