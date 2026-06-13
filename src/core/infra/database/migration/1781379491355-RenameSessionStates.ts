import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSessionStates1781379491355 implements MigrationInterface {
  name = 'RenameSessionStates1781379491355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."session_state_enum" RENAME TO "session_state_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."session_state_enum" AS ENUM('WAITING_FOR_SECOND_PLAYER', 'WAITING_FOR_CHARACTER_CHOICE', 'READY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" TYPE "public"."session_state_enum" USING (CASE "state"::text WHEN 'OPEN' THEN 'WAITING_FOR_SECOND_PLAYER' WHEN 'CLOSED' THEN 'READY' END::"public"."session_state_enum")`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" SET DEFAULT 'WAITING_FOR_SECOND_PLAYER'`,
    );
    await queryRunner.query(`DROP TYPE "public"."session_state_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."session_state_enum" RENAME TO "session_state_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."session_state_enum" AS ENUM('OPEN', 'CLOSED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" TYPE "public"."session_state_enum" USING (CASE "state"::text WHEN 'WAITING_FOR_SECOND_PLAYER' THEN 'OPEN' WHEN 'WAITING_FOR_CHARACTER_CHOICE' THEN 'OPEN' WHEN 'READY' THEN 'CLOSED' END::"public"."session_state_enum")`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" SET DEFAULT 'OPEN'`,
    );
    await queryRunner.query(`DROP TYPE "public"."session_state_enum_old"`);
  }
}
