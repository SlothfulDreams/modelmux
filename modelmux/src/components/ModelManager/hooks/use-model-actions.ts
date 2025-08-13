import { pullModel, deleteModel, type OllamaModel } from "@/lib/ollama";

interface UseModelActionsProps {
  loading: {
    install: Record<string, boolean>;
    uninstall: Record<string, boolean>;
    fetch: boolean;
  };
  setLoading: (loading: any) => void;
  setProgress: (progress: any) => void;
  setError: (error: string | null) => void;
  loadInstalledModels: () => Promise<void>;
}

export function useModelActions({
  loading,
  setLoading,
  setProgress,
  setError,
  loadInstalledModels,
}: UseModelActionsProps) {
  const handleInstall = async (modelName: string) => {
    if (loading.install[modelName]) {
      return;
    }

    setLoading((prev: any) => ({
      ...prev,
      install: { ...prev.install, [modelName]: true },
    }));
    setError(null);

    try {
      await pullModel(modelName, (progressData) => {
        setProgress((prev: any) => ({
          ...prev,
          [modelName]: progressData,
        }));
      });
      await loadInstalledModels();
    } catch (error) {
      console.error("Failed to install model:", error);
      setError(`Failed to install ${modelName}. Please try again.`);
    } finally {
      setLoading((prev: any) => ({
        ...prev,
        install: { ...prev.install, [modelName]: false },
      }));
      setProgress((prev: any) => {
        const { [modelName]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleUninstall = async (model: OllamaModel) => {
    setLoading((prev: any) => ({
      ...prev,
      uninstall: { ...prev.uninstall, [model.name]: true },
    }));
    setError(null);
    try {
      await deleteModel(model.name);
      await loadInstalledModels();
    } catch (error) {
      console.error("Failed to uninstall model:", error);
      setError(`Failed to uninstall ${model.name}. Please try again.`);
    } finally {
      setLoading((prev: any) => ({
        ...prev,
        uninstall: { ...prev.uninstall, [model.name]: false },
      }));
    }
  };

  return {
    handleInstall,
    handleUninstall,
  };
}