import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { StatusOrder } from 'src/common/utils/enums';

export class SalesDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsEnum(StatusOrder, {
    message: 'status must be one of: ' + Object.values(StatusOrder).join(', '),
  })
  status?: StatusOrder;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], {
    message:
      'orderIn must be one of: ' + Object.values(['ASC', 'DESC']).join(', '),
  })
  orderIn?: string;
}

export class NewSaleDto {
  @IsString()
  customerId: string;

  @IsString()
  productId: string;

  @IsNumber()
  quantity: string;

  @IsEnum(StatusOrder, {
    message: 'status must be one of: ' + Object.values(StatusOrder).join(', '),
  })
  status: StatusOrder;

  @IsOptional()
  @IsBoolean()
  isRegistered: boolean;
}

export class UpdateSaleDto {
  @IsOptional()
  @IsEnum(StatusOrder, {
    message: 'status must be one of: ' + Object.values(StatusOrder).join(', '),
  })
  status: StatusOrder;

  @IsOptional()
  @IsString()
  registeredBy: string;
}
