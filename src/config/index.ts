type APIEnvVars = {
  VITE_BACKEND_URL: string;
  VITE_BACKEND_ONLINE: string;
};

export const config: APIEnvVars = {
  VITE_BACKEND_URL: "",
  VITE_BACKEND_ONLINE: ""
};

export async function loadConfig() {
  const configuration = import.meta.env.PROD ? await fetchApi() : fetchLocal();
  console.log("in env: ", import.meta.env);
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
