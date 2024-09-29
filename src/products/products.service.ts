import { HttpStatus, Inject } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { products } from 'src/drizzle/schema/schema';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { count, eq } from 'drizzle-orm';
import { RpcException } from '@nestjs/microservices';
import {RpcNotFoundErrorException} from "../common/errors/rpc.error"

export class ProductsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  async create(createProductDto: CreateProductDto) {
    return await this.db.insert(products).values(createProductDto).returning();
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { page, limit } = paginationDTO;
    const totalCount = await this.db
      .select({ count: count() })
      .from(products)
      .where(eq(products.available, true));
    const lastPage = Math.ceil(totalCount[0].count / paginationDTO.limit);
    const data = await this.db.query.products.findMany({
      limit,
      offset: paginationDTO.limit * (paginationDTO.page - 1),
      where: eq(products.available, true),
    });
    return {
      data,
      meta: {
        currentPage: page,
        lastPage,
        totalProducts: totalCount[0].count,
        hasNextPage: page < lastPage,
        hasPreviousPage: page > 1,
        nextPage: data.length === 0 ? 1 : page + 1,
        previousPage: page - 1 === 0 ? page : page - 1,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.db.query.products.findFirst({
      where: eq(products.id, id),
    });
    if (!product) throw new RpcNotFoundErrorException(`Product with id ${id} not Found` );
    return { data: product };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...price } = updateProductDto;
    const productUpdate = await this.db
      .update(products)
      .set(price)
      .where(eq(products.id, id))
      .returning();
    return {
      data: productUpdate,
    };
  }

  async remove(id: number) {
    const product = await this.db
      .update(products)
      // @ts-ignore
      .set({ available: false })
      .where(eq(products.id, id))
      .returning();
    return product;
  }
}
