import { useState } from "react";
import { type OllamaModel } from "@/lib/ollama";
import { useModelManager } from "./hooks/use-model-manager";
import { useModelActions } from "./hooks/use-model-actions";
import { getFilteredAvailableModels } from "./utils/model-filters";
import { LoadingDisplay } from "./components/loading-display";
import { ErrorDisplay } from "./components/error-display";
import { InstalledModelsTable } from "./components/installed-models-table";
import { AvailableModelsTable } from "./components/available-models-table";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";

export function ModelManagerInterface() {
  const {
    installedModels,
    availableModels,
    loading,
    progress,
    error,
    setLoading,
    setProgress,
    setError,
    loadInstalledModels,
  } = useModelManager();

  const { handleInstall, handleUninstall } = useModelActions({
    loading,
    setLoading,
    setProgress,
    setError,
    loadInstalledModels,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    model: OllamaModel | null;
  }>({ open: false, model: null });

  const filteredAvailableModels = getFilteredAvailableModels(
    installedModels,
    availableModels
  );

  const handleUninstallClick = (model: OllamaModel) => {
    setDeleteDialog({ open: true, model });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.model) {
      handleUninstall(deleteDialog.model);
      setDeleteDialog({ open: false, model: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, model: null });
  };

  if (loading.fetch) {
    return <LoadingDisplay />;
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      <h1 className="text-2xl font-bold">Manage Models</h1>

      {error && (
        <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      )}

      <InstalledModelsTable
        models={installedModels}
        loading={loading.uninstall}
        onUninstall={handleUninstallClick}
      />

      <AvailableModelsTable
        models={filteredAvailableModels}
        loading={loading.install}
        progress={progress}
        onInstall={handleInstall}
      />

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        model={deleteDialog.model}
        loading={
          deleteDialog.model ? loading.uninstall[deleteDialog.model.name] : false
        }
        onOpenChange={(open) =>
          setDeleteDialog({ open, model: deleteDialog.model })
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}