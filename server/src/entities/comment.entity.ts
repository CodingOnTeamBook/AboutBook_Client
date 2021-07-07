import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Review } from './review.entity';

@Entity('comment', { schema: 'Rebook' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'text' })
  text: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Review, (review) => review.comments)
  review: Review;
}
