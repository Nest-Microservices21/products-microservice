import { Inject } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { products } from 'src/drizzle/schema/schema';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { and, count, eq, inArray } from 'drizzle-orm';
import {
  RpcNoContentException,
  RpcNotFoundErrorException,
} from '../common/exceptions/rpc.exception';

export class ProductsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  async create(createProductDto: CreateProductDto) {
    return await this.db.insert(products).values(createProductDto).returning();
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { page, limit } = paginationDTO;
    const totalCount = await this.db
      .select({ count: count(products.id) })
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
    if (!product)
      throw new RpcNotFoundErrorException(`Product with id ${id} not Found`);
    return { data: product };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...price } = updateProductDto;
    if (Object.keys(price).length === 0) throw new RpcNoContentException('');

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
      .where(and(eq(products.id, id), eq(products.available, true)))
      .returning();
    const isMessage = product.length === 0;
    return {
      message: isMessage
        ? 'No resources were deleted'
        : 'Resource deleted successfully',
      data: product[0],
    };
  }
  async validate(ids: number[]) {
    const existsIds = await this.db
      .select({ id: products.id, price: products.price })
      .from(products)
      .where(inArray(products.id, ids));

    return existsIds;
  }
}
