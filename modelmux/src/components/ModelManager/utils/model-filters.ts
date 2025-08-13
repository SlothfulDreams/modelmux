import { formatModelName, type OllamaModel, type AvailableModel } from "@/lib/ollama";

export function getFilteredAvailableModels(
  installedModels: OllamaModel[],
  availableModels: AvailableModel[]
) {
  const installedNames = installedModels.map((m) => formatModelName(m.name));
  return availableModels.filter(
    (model) => !installedNames.includes(formatModelName(model.model_name)),
  );
}