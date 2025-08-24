import { init, id } from '@instantdb/react';
import schema from '../instant.schema';

const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;

export const db = init({ appId: APP_ID, schema });

export { id };