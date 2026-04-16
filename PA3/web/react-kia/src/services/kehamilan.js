import api from "./api";

const BASE = "/tenaga-kesehatan/ibu-hamil/active";

export const getKehamilanList = async () => {
  const res = await api.get(BASE);
  return res.data.data;
};