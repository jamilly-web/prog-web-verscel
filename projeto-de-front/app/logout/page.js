"use client";

import { userLogout } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStorage } from "@/zustand";
// Importando o CSS Module correspondente
import styles from "./logout.module.css";

export default function LogOut() { // Corrigido de SignUp para LogOut
  const router = useRouter();
  const { loggedUser, setLoggedUser } = useUserStorage((state) => state);

  const logoutMutation = useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      console.log("user logged out");
      setLoggedUser(null);
      router.replace("/");
    },
    onError: (error) => {
      alert(
        "Servidor indisponível no momento. Tente novamente mais tarde. Erro: " +
          error.message,
      );
    },
  });

  const handleSubmit = (evt) => {
    evt.preventDefault();
    logoutMutation.mutate(loggedUser.sessionToken);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sair da Conta</h1>
        <p className={styles.description}>
          Tem certeza que deseja encerrar sua sessão? Você precisará digitar suas credenciais novamente para entrar.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.buttonConfirm}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Saindo..." : "Confirmar e Sair"}
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
