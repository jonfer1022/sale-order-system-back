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
  Body,
  Req,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { NewSaleDto, SalesDto, UpdateSaleDto } from './dto/sales.dto';
import { RequestAuth } from 'src/auth/types/request.type';

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
  async updateSaleById(@Param('id') id: string, @Body() body: UpdateSaleDto) {
    return await this.salesService.updateSaleById(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSaleById(@Param('id') id: string) {
    return await this.salesService.deleteSaleById(id);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createSale(@Body() body: NewSaleDto, @Req() req: RequestAuth) {
    return await this.salesService.createSale({
      ...body,
      quantity: Number(body.quantity),
      registeredBy: Boolean(body.isRegistered) ? req.user.id : null,
    });
  }
}
