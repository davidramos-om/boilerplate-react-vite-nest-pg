import { paths } from 'src/routes/paths';

export const HOST_API = import.meta.env.VITE_HOST_API;
export const ASSETS_API = import.meta.env.VITE_ASSETS_API;

export const PATH_AFTER_LOGIN = paths.dashboard.root;

export const APP_CONFIG = {
  GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:5555/graphql',
  ENVIROMENT: import.meta.env.VITE_ENVIROMENT || 'dev',
}