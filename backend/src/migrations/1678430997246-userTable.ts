import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTable1678430997246 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE users (
            id serial PRIMARY KEY,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20) NOT NULL,
            is_active int NOT NULL DEFAULT 0,
            register_token VARCHAR(100) DEFAULT NULL,
            confirm_email_at timestamp DEFAULT CURRENT_TIMESTAMP,
            reset_password_at timestamp DEFAULT NULL,
            reset_password_token VARCHAR(100) DEFAULT NULL,
            attack_count int DEFAULT 0,
            lock_time timestamp DEFAULT CURRENT_TIMESTAMP,
            created_at timestamp  DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp  NULL
            );
            ALTER TABLE users ADD CONSTRAINT constraint_email_unique UNIQUE (email);
        `);
    await queryRunner.query(`CREATE INDEX idx_users_email ON users(email)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE users`);
  }
}
