import { init, id, lookup, UpdateParams } from '@instantdb/react';
import schema, { AppSchema } from '@/instant.schema';

const APP_ID = "fe566e87-9a00-421e-b582-747a4fa7fa91";

export const db = init({ appId: APP_ID, schema });

export { id, lookup, type UpdateParams, type AppSchema };