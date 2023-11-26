import { MigrationInterface, QueryRunner } from 'typeorm';

export class Fix1701003009320 implements MigrationInterface {
  name = 'Fix1701003009320';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "Participants"
            ADD "turnOrder" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "Participants" DROP CONSTRAINT "FK_92af9a31e4454b91057d41b2eca"
        `);
    await queryRunner.query(`
            ALTER TABLE "Games" DROP CONSTRAINT "PK_1950492f583d31609c5e9fbbe12"
        `);
    await queryRunner.query(`
            ALTER TABLE "Games" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "Games"
            ADD "id" SERIAL NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "Games"
            ADD CONSTRAINT "PK_1950492f583d31609c5e9fbbe12" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            ALTER TABLE "Participants" DROP COLUMN "gameId"
        `);
    await queryRunner.query(`
            ALTER TABLE "Participants"
            ADD "gameId" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "Participants"
            ADD CONSTRAINT "FK_92af9a31e4454b91057d41b2eca" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "Participants" DROP CONSTRAINT "FK_92af9a31e4454b91057d41b2eca"
        `);
    await queryRunner.query(`
            ALTER TABLE "Participants" DROP COLUMN "gameId"
        `);
    await queryRunner.query(`
            ALTER TABLE "Participants"
            ADD "gameId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "Games" DROP CONSTRAINT "PK_1950492f583d31609c5e9fbbe12"
        `);
    await queryRunner.query(`
            ALTER TABLE "Games" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "Games"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
    await queryRunner.query(`
            ALTER TABLE "Games"
            ADD CONSTRAINT "PK_1950492f583d31609c5e9fbbe12" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            ALTER TABLE "Participants"
            ADD CONSTRAINT "FK_92af9a31e4454b91057d41b2eca" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "Participants" DROP COLUMN "turnOrder"
        `);
  }
}
