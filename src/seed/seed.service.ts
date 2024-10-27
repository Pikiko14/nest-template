import { Injectable } from '@nestjs/common';
import { seedData } from './data/seed.data';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.productsService.deleteAllProducts();
    // products seed data
    const { products } = seedData;
    const insertPromises = [];
    products.forEach((product) =>
      insertPromises.push(this.productsService.create(product)),
    );
    await Promise.all(insertPromises);

    // response
    return 'Seed executed successfully';
  }
}
