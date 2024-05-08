import user from "../http/user";

import { useEffect, useState } from "react";

export function useUser() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    user.getUserDetails().then((data) => {
      setUserData(data);
    });
  }, []);

  return { userData };
}
