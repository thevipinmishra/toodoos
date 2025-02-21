import { useStore } from "../store";

export const useUserName = () => {
  const userName = useStore((state) => state.name);
  const setUserName = useStore((state) => state.setName);
  return { userName, setUserName };
};
