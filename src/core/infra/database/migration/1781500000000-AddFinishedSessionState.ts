import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFinishedSessionState1781500000000 implements MigrationInterface {
  name = 'AddFinishedSessionState1781500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."session_state_enum" RENAME TO "session_state_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."session_state_enum" AS ENUM('WAITING_FOR_SECOND_PLAYER', 'WAITING_FOR_CHARACTER_CHOICE', 'READY', 'FINISHED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" TYPE "public"."session_state_enum" USING "state"::text::"public"."session_state_enum"`,
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
      `CREATE TYPE "public"."session_state_enum" AS ENUM('WAITING_FOR_SECOND_PLAYER', 'WAITING_FOR_CHARACTER_CHOICE', 'READY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" TYPE "public"."session_state_enum" USING "state"::text::"public"."session_state_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ALTER COLUMN "state" SET DEFAULT 'WAITING_FOR_SECOND_PLAYER'`,
    );
    await queryRunner.query(`DROP TYPE "public"."session_state_enum_old"`);
  }
}
