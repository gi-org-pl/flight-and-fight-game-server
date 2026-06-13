import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSession1781302271579 implements MigrationInterface {
  name = 'InitSession1781302271579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."session_state_enum" AS ENUM('OPEN', 'CLOSED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" character varying NOT NULL, "state" "public"."session_state_enum" NOT NULL DEFAULT 'OPEN', "firstPlayerId" character varying NOT NULL, "secondPlayerId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TYPE "public"."session_state_enum"`);
  }
}
