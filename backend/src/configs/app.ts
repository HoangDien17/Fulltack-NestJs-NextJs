export default () => ({
  db: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 5432),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ['build/**/*.entity{.ts,.js}'],
    migrations: ['build/db/migrations/*.js', __dirname + '../migrations/*.{ts,js}'],
    seeds: ['build/seeds/*.js', __dirname + '../seeds/*.{ts,js}'],
    options: {
      encrypt: true,
      enableArithAbort: true,
      autoLoadEntities: true
    },
    cli: {
      migrationsDir: 'src/db/migrations'
    },
    synchronize: false,
    migrationsRun: true,
    logging: false
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    refreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,
    accessTokenExpiryTime: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME,
    accessTokenExpiryTimeConfirmRegister: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME_CONFIRM_REGISTER,
    refreshTokenExpiryTime: process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME
  },
  email: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    ciphers: process.env.SMTP_CIPHERS,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD
  },
  app: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  frontendUrl: process.env.FRONTEND_URL,
  backendUrl: process.env.BACKEND_URL,
});
