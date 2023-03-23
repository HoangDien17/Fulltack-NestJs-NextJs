import { EntitySchema } from 'typeorm';
import { Articles } from './articles.entity';

export const ArticlesSchema = new EntitySchema<Articles>({
  name: 'Articles',
  target: Articles,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
  }
});