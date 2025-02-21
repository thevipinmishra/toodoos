import { usePersonStore } from "../store";

export const useUserName = () => {
  const name = usePersonStore((state) => state.name);
  const setName = usePersonStore((state) => state.setName);
  return { name, setName };
};
