type APIEnvVars = {
  VITE_BACKEND_URL: string;
};

export const config: APIEnvVars = {
  VITE_BACKEND_URL: "",
};

export async function loadConfig() {
  const configuration = import.meta.env.PROD ? await fetchApi() : fetchLocal();
  Object.assign(config, configuration);
}

const fetchLocal = () => import.meta.env as unknown as APIEnvVars;

const fetchApi = () =>
  fetch(`${window.location.origin}/app-config`)
    .then((response) => response.json() as Promise<APIEnvVars>)
    .catch((e) => {
      console.error("Error fetching config: ", e);
      return {} as APIEnvVars;
    });
