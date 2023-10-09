import { useEvent } from "@nucleoidjs/synapses";

function Loading() {
  const [linearProgress] = useEvent("LOADED", {
    loading: false,
    progress: 0,
  });
  if (linearProgress.loading) {
    return "loading";
  } else {
    return null;
  }
}

export default Loading;
