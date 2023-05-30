import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
@Entity()
export class Manager extends Base {
  @Column({ unique: true })
  entityDid!: string;
  @Column()
  managerDid!: string;
  @Column()
  managerAddress!: string;
}
