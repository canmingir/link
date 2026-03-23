import { useSettingsContext } from "../components/settings/context";

const useBeta = () => {
  const { beta } = useSettingsContext();
  return beta;
};

export default useBeta;
