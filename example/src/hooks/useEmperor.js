import http from "../http";

const useEmperor = () => {
  const getEmperors = async () => {
    const res = await http.get("/emperors");
    return res.data;
  };

  const getEmperorById = async (id) => {
    const res = await http.get(`/emperors/${id}`);
    return res.data;
  };

  return { getEmperors, getEmperorById };
};

export default useEmperor;
