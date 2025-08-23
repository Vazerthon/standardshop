import { id } from '@instantdb/react';
import { db } from "@/lib/db";

export const useTemplates = () => {
  const query = { template: {} };
  const { isLoading, error, data } = db.useQuery(query);
  return {
    templates: data?.template || undefined,
    loading: isLoading,
    error: error as Error | null,
  };
}

export const useCreateTemplate = () =>
  (name: string) =>
    db.transact(db.tx.template[id()].create({ name, createdAt: new Date() }));
