import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsuarioClienteOuFornecedor1780102171897 implements MigrationInterface {
    name = 'AddUsuarioClienteOuFornecedor1780102171897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cliente_ou_fornecedor" ADD "usuario_id" integer`);
        await queryRunner.query(`ALTER TABLE "cliente_ou_fornecedor" ADD CONSTRAINT "FK_1e7369094bf15f074cffb74bace" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cliente_ou_fornecedor" DROP CONSTRAINT "FK_1e7369094bf15f074cffb74bace"`);
        await queryRunner.query(`ALTER TABLE "cliente_ou_fornecedor" DROP COLUMN "usuario_id"`);
    }

}
