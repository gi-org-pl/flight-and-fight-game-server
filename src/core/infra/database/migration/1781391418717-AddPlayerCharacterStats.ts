import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlayerCharacterStats1781391418717 implements MigrationInterface {
  name = 'AddPlayerCharacterStats1781391418717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."player_character_superpower_enum" AS ENUM('LIGHT', 'DARK', 'WATER', 'GRASS', 'FIRE', 'ELECTRIC', 'GROUND', 'AIR', 'ICE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" ADD "superpower" "public"."player_character_superpower_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" ADD "intelligence" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" ADD "defense" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" ADD "power" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" ADD "health" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_character" DROP COLUMN "health"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" DROP COLUMN "power"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" DROP COLUMN "defense"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" DROP COLUMN "intelligence"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" DROP COLUMN "superpower"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."player_character_superpower_enum"`,
    );
  }
}
