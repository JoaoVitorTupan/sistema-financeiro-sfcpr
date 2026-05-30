import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsuarios1778986172065 implements MigrationInterface {
    name = 'UpdateUsuarios1778986172065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."usuario_role_enum" AS ENUM('administrador', 'financeiro', 'gestor')`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nome" text NOT NULL, "email" text NOT NULL, "senha" text NOT NULL, "role" "public"."usuario_role_enum" NOT NULL DEFAULT 'financeiro', "criado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_role_enum"`);
    }

}
