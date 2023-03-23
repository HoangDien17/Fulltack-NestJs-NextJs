import { DataSource } from 'typeorm';

const connectionSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'mysecretpassword',
  database: 'test',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.ts', 'dist/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true
});

export default connectionSource;
