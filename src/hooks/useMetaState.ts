import { useStore } from "../store";

export const useUserName = () => {
  const name = useStore((state) => state.name);
  const setName = useStore((state) => state.setName);
  return { name, setName };
};

export const useSelectedProject = () => {
  const selectedProject = useStore((state) => state.selectedProject);
  const setSelectedProject = useStore((state) => state.setSelectedProject);
  return {
    selectedProject,
    setSelectedProject,
  } as const;
};
