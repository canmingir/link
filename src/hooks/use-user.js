import user from "../http/user";

import { useEffect, useState } from "react";

export function useUser() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    user.get("https://api.github.com/user").then((response) => {
      setUserData(response.data);
    });
  }, []);

  return { userData };
}
