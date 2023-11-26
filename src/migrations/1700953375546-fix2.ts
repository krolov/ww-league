import { MigrationInterface, QueryRunner } from "typeorm";

export class Fix21700953375546 implements MigrationInterface {
    name = 'Fix21700953375546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Players"
            ALTER COLUMN "rootId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "Players"
            ALTER COLUMN "other"
            SET DEFAULT '{}'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Players"
            ALTER COLUMN "other" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "Players"
            ALTER COLUMN "rootId"
            SET NOT NULL
        `);
    }

}
