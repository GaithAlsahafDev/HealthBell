import Axios from "axios";

export const api = Axios.create({
  baseURL: "https://9a73b5b1-efba-469d-ab29-b329608cce9b.mock.pstmn.io",
  timeout: 10000,
});

// يمكنك إضافة interceptors لاحقاً عند الحاجة
