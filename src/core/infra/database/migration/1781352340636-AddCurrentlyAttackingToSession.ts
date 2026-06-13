import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrentlyAttackingToSession1781352340636 implements MigrationInterface {
  name = 'AddCurrentlyAttackingToSession1781352340636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" ADD "currentlyAttackingPlayerId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP COLUMN "currentlyAttackingPlayerId"`,
    );
  }
}
