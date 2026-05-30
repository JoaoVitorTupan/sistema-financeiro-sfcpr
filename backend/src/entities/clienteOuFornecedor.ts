import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { Usuario } from "./usuario";
export type Tipo = "cliente" | "fornecedor";

@Entity("cliente_ou_fornecedor")
export class ClienteOuFornecedor {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ["cliente", "fornecedor"]
  })
  tipo: Tipo;

  @Column({ type: "varchar" })
  nome: string;

  @Column({ type: "varchar", unique: true })
  cpf_cnpj: string;

  @Column({ type: "varchar", nullable: true })
  email: string;

  @Column({ type: "varchar", nullable: true })
  telefone: string;

  @Column({ type: "varchar", nullable: true })
  endereco: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuario_id" })
  usuario: Usuario;
}