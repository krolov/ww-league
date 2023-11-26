import { MigrationInterface, QueryRunner } from "typeorm";

export class OldId1700954185998 implements MigrationInterface {
    name = 'OldId1700954185998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Games"
            ADD "oldId" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Games" DROP COLUMN "oldId"
        `);
    }

}
