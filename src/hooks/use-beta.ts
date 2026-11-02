import { useSettingsContext } from "../components/settings/context";

const useBeta = () => {
  const { beta } = useSettingsContext() as { beta?: boolean };
  return beta;
};

export default useBeta;
