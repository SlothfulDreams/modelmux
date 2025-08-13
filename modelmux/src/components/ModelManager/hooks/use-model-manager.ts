import { useState, useEffect } from "react";
import {
  modelList,
  getAvailableModels,
  type OllamaModel,
  type AvailableModel,
} from "@/lib/ollama";

interface LoadingState {
  install: Record<string, boolean>;
  uninstall: Record<string, boolean>;
  fetch: boolean;
}

interface ProgressState {
  percentage: number;
  status: string;
}

export function useModelManager() {
  const [installedModels, setInstalledModels] = useState<OllamaModel[]>([]);
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    install: {},
    uninstall: {},
    fetch: true,
  });
  const [progress, setProgress] = useState<Record<string, ProgressState>>({});
  const [error, setError] = useState<string | null>(null);

  const loadInstalledModels = async () => {
    try {
      const models = await modelList();
      setInstalledModels(models);
    } catch (error) {
      console.error("Failed to load installed models:", error);
      setError("Failed to load installed models. Please try again.");
    }
  };

  const loadAvailableModels = async () => {
    try {
      const models = await getAvailableModels();
      setAvailableModels(models);
    } catch (error) {
      console.error("Failed to load available models:", error);
      setError(
        "Failed to load available models. Please check your internet connection.",
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading((prev) => ({ ...prev, fetch: true }));
      await Promise.all([loadInstalledModels(), loadAvailableModels()]);
      setLoading((prev) => ({ ...prev, fetch: false }));
    };
    loadData();
  }, []);

  return {
    installedModels,
    availableModels,
    loading,
    progress,
    error,
    setLoading,
    setProgress,
    setError,
    loadInstalledModels,
  };
}