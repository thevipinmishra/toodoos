import { useStore } from "../store";

interface Project {
  id: string;
  title: string;
}

export const useProjects = () => useStore((state) => state.projects);
export const useProject = (id: string) =>
  useStore((state) => state.projects.find((project) => project.id === id));

export const useProjectActions = () => {
  const addProject = (project: { name: string }) => {
    const store = useStore.getState();
    store.addProject(project.name);
  };

  const updateProject = (id: string, updates: { name: string }) => {
    const store = useStore.getState();
    store.updateProject(id, updates.name);
  };

  const deleteProject = (id: string) => {
    const store = useStore.getState();
    store.deleteProject(id);
  };

  return {
    addProject,
    updateProject,
    deleteProject,
  };
};

export type { Project };