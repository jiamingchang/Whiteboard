import axios from "axios";
import { UPLOAD_URL } from "./config";

export const uploadBase64 = (data = {}) =>
  axios.post(UPLOAD_URL + "/static/uploadBase64", data);
