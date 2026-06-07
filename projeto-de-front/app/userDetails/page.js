"use client";

import { currentUser, verificationEmailRequest } from "@/api";
import { useUserStorage } from "@/zustand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
// Importando o CSS Module
import styles from "./userdetails.module.css";

export default function UserDetails() {
  const loggedUser = useUserStorage((state) => state.loggedUser);
  const queryClient = useQueryClient();

  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => currentUser(loggedUser.sessionToken),
  });

  const mutation = useMutation({
    mutationFn: verificationEmailRequest,
    onSuccess: () => {
      alert("Verifique a sua caixa de e-mail para validar a conta.");
    },
    onError: (error) => {
      alert(
        "Servidor indisponível no momento. Tente novamente mais tarde. Erro: " +
          error.message,
      );
    },
  });

  return (
    <div className={styles.container}>
      {/* Link superior para voltar à Home */}
      <Link href="/" className={styles.backLink}>
        ← Voltar para Home
      </Link>

      <div className={styles.card}>
        {/* Banner de erro caso a query falhe */}
        {isError && (
          <div className={styles.errorBanner}>
            <p className={styles.errorText}>Erro na busca: {error.message}</p>
          </div>
        )}

        <h1 className={styles.title}>
          Detalhes do Usuário
          {isLoading && <span className={styles.statusText}>(carregando...)</span>}
          {isFetching && <span className={styles.statusText}>[buscando...]</span>}
        </h1>
        <p className={styles.subtitle}>Dados do perfil salvos no banco de dados.</p>

        {/* Caixa de ação para verificar o e-mail */}
        <div className={styles.actionSection}>
          <p className={styles.actionText}>
            Seu e-mail ainda não foi validado? Peça uma nova confirmação.
          </p>
          <button 
            onClick={() => mutation.mutate(loggedUser.email)}
            disabled={mutation.isPending}
            className={styles.buttonVerify}
          >
            {mutation.isPending ? "Enviando..." : "Verificar E-mail"}
          </button>
        </div>

        {/* Bloco de dados JSON estilizado como console/terminal */}
        <pre className={styles.jsonContainer}>
          {JSON.stringify(data ?? {}, null, 2)}
        </pre>
      </div>
    </div>
  );
}
