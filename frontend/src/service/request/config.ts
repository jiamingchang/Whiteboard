let BASE_URL = "https://hm.sztufsrlab.com";
const TIME_OUT = 10000;

if (process.env.NODE_ENV === "development") {
  BASE_URL = "http://127.0.0.1:8080";
} else if (process.env.NODE_ENV === "production") {
  BASE_URL = "http://127.0.0.1:8080";
} else {
  BASE_URL = "http://127.0.0.1:8080/";
}

export { BASE_URL, TIME_OUT };
