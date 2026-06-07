""use client";

import { userLogin } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStorage } from "@/zustand";
// Importando o arquivo CSS Module
import styles from "./login.module.css"; 

export default function Login() {
  const router = useRouter();
  const setLoggedUser = useUserStorage((state) => state.setLoggedUser);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  
  const loginMutation = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      console.log("user data received from back4app:", user, data);
      setLoggedUser(data);
      router.replace("/");
    },
    onError: (error) => {
      alert("Erro de Login. Erro: " + error.message);
    },
  });

  const handleChange = (evt) => {
    setUser({ ...user, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!user.username || !user.password) {
      alert("Preencha todos os campos");
      return;
    }
    loginMutation.mutate(user);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Corrigido o título de 'Sign Up' para 'Login' condizente com a tela */}
        <h1 className={styles.title}>Acessar Conta</h1>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="username">Nome do usuário</label>
            <input
              id="username"
              name="username"
              placeholder="Digite seu usuário"
              value={user.username}
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
              placeholder="Digite sua senha"
              value={user.password}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.buttonSubmit}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Autenticando..." : "Login"}
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
