import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlayerCharacters1781342804105 implements MigrationInterface {
  name = 'AddPlayerCharacters1781342804105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."player_character_charactertype_enum" AS ENUM('IRIS', 'ZEPHYR', 'WENDY', 'SKYE', 'SUNNY', 'AURA', 'NEIL', 'GALE', 'THORA', 'VEGA')`,
    );
    await queryRunner.query(
      `CREATE TABLE "player_character" ("playerId" character varying NOT NULL, "characterType" "public"."player_character_charactertype_enum" NOT NULL, CONSTRAINT "PK_17212bf8c668b0ec276c70a32d1" PRIMARY KEY ("playerId", "characterType"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_character" ADD CONSTRAINT "FK_9847fa163c330d60c105abaad3d" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_character" DROP CONSTRAINT "FK_9847fa163c330d60c105abaad3d"`,
    );
    await queryRunner.query(`DROP TABLE "player"`);
    await queryRunner.query(`DROP TABLE "player_character"`);
    await queryRunner.query(
      `DROP TYPE "public"."player_character_charactertype_enum"`,
    );
  }
}
