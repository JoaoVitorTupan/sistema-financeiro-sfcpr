import { MigrationInterface, QueryRunner } from "typeorm";

export class AtualizacaoBanco1780098977691 implements MigrationInterface {
    name = 'AtualizacaoBanco1780098977691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cliente_ou_fornecedor_tipo_enum" AS ENUM('cliente', 'fornecedor')`);
        await queryRunner.query(`CREATE TABLE "cliente_ou_fornecedor" ("id" SERIAL NOT NULL, "tipo" "public"."cliente_ou_fornecedor_tipo_enum" NOT NULL, "nome" character varying NOT NULL, "cpf_cnpj" character varying NOT NULL, "email" character varying, "telefone" character varying, "endereco" character varying, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_6b25f2f2fc9572aacabaaa16446" UNIQUE ("cpf_cnpj"), CONSTRAINT "PK_34f60f350f4548d304bb076609d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cliente_ou_fornecedor"`);
        await queryRunner.query(`DROP TYPE "public"."cliente_ou_fornecedor_tipo_enum"`);
    }

}
