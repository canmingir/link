import { useEffect, useState } from "react";

import axios from "axios";
import config from "../../config";

const useEmperor = (id) => {
  const [emperor, setEmperor] = useState([]);

  useEffect(() => {
    getEmperorById(id);
  }, []);

  const getEmperorById = async (id) => {
    const response = await axios.get(`${config.api}/emperors/${id}`);
    setEmperor(response.data);
  };

  return { emperor };
};

export default useEmperor;
