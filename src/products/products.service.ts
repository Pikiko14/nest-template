import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { ProductImage, Product } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images, ...details } = createProductDto;
      const product = this.productRepository.create({
        ...details,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });
      return products;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    try {
      let product;
      if (!isValidUUID(term)) {
        const queryBuilder =
          this.productRepository.createQueryBuilder('product');
        product = await queryBuilder
          .where('UPPER(title) =:title or LOWER(slug) =:slug', {
            title: term.toUpperCase(),
            slug: term.toLocaleLowerCase(),
          })
          .leftJoinAndSelect('product.images', 'productImages')
          .getOne();
      } else {
        product = await this.productRepository.findOneBy({ id: term });
      }

      if (!product) throw new NotFoundException(`Product #${term} not found`);

      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...details } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...details,
    });
    if (!product) throw new NotFoundException('Product #${id} not found');

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      if (images && images.length > 0) {
        queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }

    return product;
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      if (!product) throw new NotFoundException(`Product #${id} not found`);
      await this.productRepository.remove(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(error.detail || error.message);
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
