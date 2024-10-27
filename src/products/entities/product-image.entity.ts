import { Product } from './product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  url: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
    eager: false,
  })
  product: Product;
}
