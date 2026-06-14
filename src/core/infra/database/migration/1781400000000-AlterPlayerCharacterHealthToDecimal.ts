import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPlayerCharacterHealthToDecimal1781400000000 implements MigrationInterface {
  name = 'AlterPlayerCharacterHealthToDecimal1781400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_character" ALTER COLUMN "health" TYPE numeric(5,2) USING "health"::numeric(5,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_character" ALTER COLUMN "health" TYPE integer USING "health"::integer`,
    );
  }
}
