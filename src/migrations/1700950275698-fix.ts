import { MigrationInterface, QueryRunner } from 'typeorm';

export class Fix1700950275698 implements MigrationInterface {
  name = 'Fix1700950275698';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "Factions"
                RENAME COLUMN "vagabound" TO "vagabond"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "Factions"
                RENAME COLUMN "vagabond" TO "vagabound"
        `);
  }
}
