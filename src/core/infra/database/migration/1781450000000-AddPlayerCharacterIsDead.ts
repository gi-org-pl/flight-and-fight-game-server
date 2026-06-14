import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlayerCharacterIsDead1781450000000 implements MigrationInterface {
  name = 'AddPlayerCharacterIsDead1781450000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_character" ADD "isDead" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_character" DROP COLUMN "isDead"`,
    );
  }
}
