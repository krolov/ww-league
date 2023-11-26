import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1700948996687 implements MigrationInterface {
  name = 'Init1700948996687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "Factions" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "vagabound" boolean NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4d2cc04d7b506ad0745c3dedd02" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "Seasons" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "startDate" TIMESTAMP NOT NULL,
                "endDate" TIMESTAMP NOT NULL,
                "isCurrent" boolean NOT NULL DEFAULT false,
                "craetedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4021e1npm d9225c764d267ae33da9c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "Games" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "async" boolean NOT NULL,
                "deck" character varying NOT NULL,
                "map" character varying NOT NULL,
                "rc" boolean NOT NULL,
                "discordLink" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "seasonId" integer,
                "undraftedId" integer,
                CONSTRAINT "PK_1950492f583d31609c5e9fbbe12" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "Players" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "discordId" character varying,
                "rootId" character varying NOT NULL,
                "other" jsonb NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_84d6935ba611485b4cc881776da" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "Games"
            ADD CONSTRAINT "FK_ce37dd85cd94efc65b163b059f8" FOREIGN KEY ("seasonId") REFERENCES "Seasons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "Games"
            ADD CONSTRAINT "FK_732c7e1547c74627736c7620395" FOREIGN KEY ("undraftedId") REFERENCES "Factions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "Games" DROP CONSTRAINT "FK_732c7e1547c74627736c7620395"
        `);
    await queryRunner.query(`
            ALTER TABLE "Games" DROP CONSTRAINT "FK_ce37dd85cd94efc65b163b059f8"
        `);
    await queryRunner.query(`
            DROP TABLE "Players"
        `);
    await queryRunner.query(`
            DROP TABLE "Games"
        `);
    await queryRunner.query(`
            DROP TABLE "Seasons"
        `);
    await queryRunner.query(`
            DROP TABLE "Factions"
        `);
  }
}
