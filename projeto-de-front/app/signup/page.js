"use client";

import { userSignUp } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStorage } from "@/zustand";
// Importando o CSS Module criado
import styles from "./signup.module.css";

export default function SignUp() {
  const router = useRouter();
  const setLoggedUser = useUserStorage((state) => state.setLoggedUser);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const signUpMutation = useMutation({
    mutationFn: userSignUp,
    onSuccess: (data) => {
      console.log("user data received from back4app:", user, data);
      setLoggedUser({ ...user, ...data, password: undefined });
      router.replace("/");
    },
    onError: (error) => {
      alert(
        "Servidor indisponível no momento. Tente novamente mais tarde. Erro: " +
          error.message,
      );
    },
  });

  const handleChange = (evt) => {
    setUser({ ...user, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    // Validação básica antes de enviar para a mutation
    if (!user.username || !user.email || !user.password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    signUpMutation.mutate(user);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Criar Conta</h1>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="username">Nome do usuário</label>
            <input
              id="username"
              name="username"
              placeholder="Escolha um nome de usuário"
              value={user.username}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">E-mail</label>
            <input 
              id="email"
              type="email"
              name="email" 
              placeholder="seu@email.com"
              value={user.email} 
              onChange={handleChange} 
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Crie uma senha forte"
              value={user.password}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.buttonSubmit}
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? "Cadastrando..." : "Cadastrar"}
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
