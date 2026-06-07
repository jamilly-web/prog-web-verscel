"use client";

import { addTarefa, deleteTarefa, getTarefas, updateTarefa } from "@/api";
import { Tarefa } from "@/components/Tarefa";
import { useTaskFilter } from "@/zustand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
// Importando o CSS Module
import styles from "./tarefas.module.css";

export default function ListaDeTarefas() {
  const [descricao, setDescricao] = useState("");
  const { filtrarConcluidas, toggleFiltrarConcluidas } = useTaskFilter(
    (state) => state,
  );
  const queryClient = useQueryClient();
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });
  
  const addMutation = useMutation({
    mutationFn: addTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      setDescricao("");
    },
    onError: (error) => {
      alert(
        "Servidor indisponível no momento. Tente novamente mais tarde. Erro: " +
          error.message,
      );
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
    onError: (error) => {
      alert(
        "Servidor indisponível no momento. Tente novamente mais tarde. Erro: " +
          error.message,
      );
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
    onError: (error) => {
      alert(
        "Servidor indisponível no momento. Tente novamente mais tarde. Erro: " +
          error.message,
      );
    },
  });

  function handleAdicionarTarefa() {
    if (!descricao) {
      alert("Digite uma descrição");
      return;
    }
    addMutation.mutate(descricao);
  }
  function handleAtualizarTarefa(tarefa) {
    updateMutation.mutate(tarefa);
  }
  function handleRemoverTarefa(tarefa) {
    deleteMutation.mutate(tarefa);
  }

  let tarefas = data;
  if (data && filtrarConcluidas) {
    tarefas = data.filter((tarefa) => !tarefa.concluida);
  }

  return (
    <div className={styles.container}>
      {/* Link de voltar estilizado de forma discreta no topo */}
      <Link href="/" className={styles.backLink}>
        ← Voltar para Home
      </Link>

      <div className={styles.card}>
        {/* Banners de erro limpos e elegantes caso algo falhe */}
        {isError && (
          <div className={styles.errorBanner}>
            <p className={styles.errorText}>Erro na busca: {error.message}</p>
          </div>
        )}
        {addMutation.isError && (
          <div className={styles.errorBanner}>
            <p className={styles.errorText}>Erro ao adicionar: {addMutation.error.message}</p>
          </div>
        )}

        <h1 className={styles.title}>
          Lista de Tarefas
          {(isLoading || isFetching) && (
            <span className={styles.statusText}>
              {isLoading ? "carregando..." : "atualizando..."}
            </span>
          )}
        </h1>

        {/* Campo de input e botão alinhados lado a lado (Flexbox) */}
        <div className={styles.inputGroup}>
          <input
            placeholder="Digite a descrição da tarefa"
            value={descricao}
            onChange={(evt) => setDescricao(evt.target.value)}
            className={styles.input}
          />
          <button
            onClick={handleAdicionarTarefa}
            disabled={addMutation.isPending}
            className={styles.buttonAdd}
          >
            {addMutation.isPending ? "Aguarde..." : "Adicionar"}
          </button>
        </div>

        {/* Seção de Filtro */}
        <label className={styles.filterGroup}>
          <input
            type="checkbox"
            checked={filtrarConcluidas}
            onChange={toggleFiltrarConcluidas}
            className={styles.checkbox}
          />
          <span>Ocultar as tarefas concluídas</span>
        </label>

        {/* Lista de tarefas limpa, estilizada via classe */}
        <ul className={styles.taskList}>
          {tarefas?.map((tarefa) => (
            <Tarefa
              key={tarefa.objectId}
              tarefa={tarefa}
              onUpdate={handleAtualizarTarefa}
              onDelete={handleRemoverTarefa}
              disabled={updateMutation.isPending || deleteMutation.isPending}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
