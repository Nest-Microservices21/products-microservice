import { Controller, Res, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { ParseIdPipe } from './pipe/parseId.pipe';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'product.create' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'product.find_all' })
  findAll(@Payload() paginationDTO: PaginationDTO) {
    return this.productsService.findAll(paginationDTO);
  }

  @MessagePattern({ cmd: 'product.find_one' })
  findOne(@Payload('id', ParseIdPipe) id: number) {
    return this.productsService.findOne(+id);
  }

  @MessagePattern({ cmd: 'product.update' })
  async update(@Payload() updateProductDto: UpdateProductDto) {

    const response = await this.productsService.update(
      +updateProductDto.id,
      updateProductDto,
    );
    return response
  }
  @MessagePattern({ cmd: 'product.delete' })
  remove(@Payload('id', ParseIdPipe) id: number) {
    return this.productsService.remove(+id);
  }
  @MessagePattern({ cmd: 'product.validate' })
  validate(@Payload() ids: number[]) {
    return this.productsService.validate(ids)
  }
}
