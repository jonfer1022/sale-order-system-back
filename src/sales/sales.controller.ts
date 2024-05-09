import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesDto } from './dto/sales.dto';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getSales(@Query() params: SalesDto) {
    return await this.salesService.getSales({
      limit: Number(params.limit || 10),
      page: Number(params.page || 1),
      status: params.status,
      userId: params.userId,
      orderIn: params.orderIn,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSalesById(@Param('id') id: string) {
    return await this.salesService.getSalesById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateSaleById(@Param('id') id: string, @Query() params: SalesDto) {
    return await this.salesService.updateSaleById(id, params);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSaleById(@Param('id') id: string) {
    return await this.salesService.deleteSaleById(id);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createSale(@Query() params: SalesDto) {
    return await this.salesService.createSale(params);
  }
}
