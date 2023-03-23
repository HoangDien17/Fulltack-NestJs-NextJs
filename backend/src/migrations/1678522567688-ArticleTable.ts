import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleTable1678522567688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE articles (
        id serial PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at timestamp  DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp  NULL
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE articles`);
  }
}
