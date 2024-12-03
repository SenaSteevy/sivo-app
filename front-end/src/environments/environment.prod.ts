export const environment = {
  production: true,
  apiUrl: (window as any)["env"]["apiUrl"] || "http://localhost:8083"
};
