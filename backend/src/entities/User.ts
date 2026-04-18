import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text' })
    name: string

    @Column({ type: 'text', unique: true })
    email: string

    @Column({ type: 'text' })
    password: string

    @Column({
        type: 'enum',
        enum: ['administrador', 'financeiro', 'gestor'],
        default: 'financeiro'
    })
    role: string

    @CreateDateColumn()
    created_at: Date
}