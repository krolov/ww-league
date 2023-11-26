import { MigrationInterface, QueryRunner } from "typeorm";

export class Participants1700953725301 implements MigrationInterface {
    name = 'Participants1700953725301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "Participants" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "score" integer,
                "dominationCoalition" boolean NOT NULL DEFAULT false,
                "dominationCoalitionType" character varying,
                "leagueScore" numeric NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "gameId" uuid,
                "playerId" uuid,
                "factionId" integer,
                CONSTRAINT "PK_7938849a564a20e99153a744bad" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "Participants"
            ADD CONSTRAINT "FK_92af9a31e4454b91057d41b2eca" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "Participants"
            ADD CONSTRAINT "FK_4b0118096f822c12911050ee748" FOREIGN KEY ("playerId") REFERENCES "Players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "Participants"
            ADD CONSTRAINT "FK_4d731c444f70797bfed3c6edb15" FOREIGN KEY ("factionId") REFERENCES "Factions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Participants" DROP CONSTRAINT "FK_4d731c444f70797bfed3c6edb15"
        `);
        await queryRunner.query(`
            ALTER TABLE "Participants" DROP CONSTRAINT "FK_4b0118096f822c12911050ee748"
        `);
        await queryRunner.query(`
            ALTER TABLE "Participants" DROP CONSTRAINT "FK_92af9a31e4454b91057d41b2eca"
        `);
        await queryRunner.query(`
            DROP TABLE "Participants"
        `);
    }

}
