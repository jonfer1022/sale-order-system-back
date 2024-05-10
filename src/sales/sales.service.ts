import { Inject, Injectable } from '@nestjs/common';
import { Op, OrderItem } from 'sequelize';
import { StatusOrder } from 'src/common/utils/enums';
import {
  Customer,
  Products,
  SalesOrder,
  Sizes,
  TypeProducts,
  User,
} from 'src/database/models';

interface ISales {
  status?: StatusOrder | undefined;
  limit?: number | undefined;
  page?: number | undefined;
  userId?: string | undefined;
  orderIn?: string;
}

@Injectable()
export class SalesService {
  constructor(
    @Inject('SALES_REPOSITORY')
    private salesRepository: typeof SalesOrder,
    @Inject('PRODUCTS_REPOSITORY')
    private productsRepository: typeof Products,
  ) {}

  async getSales({
    limit = 10,
    page = 1,
    status,
    userId,
    orderIn = 'DESC',
  }: ISales) {
    try {
      let where = {};
      let order: Array<OrderItem> = [['createdAt', orderIn]];
      const offset = (page - 1) * limit;
      if (userId) where = { ...where, registeredBy: userId };
      if (status) where = { ...where, status };
      if (status === StatusOrder.SHIPPED) {
        where = { ...where, shippedDate: { [Op.not]: null } };
        order = [['shippedDate', orderIn]];
      }
      if (status === StatusOrder.REJECTED) {
        where = { ...where, rejectedDate: { [Op.not]: null } };
        order = [['rejectedDate', orderIn]];
      }
      return await this.salesRepository.findAndCountAll({
        where,
        order,
        limit,
        offset,
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
    } catch (error) {
      console.log('-----> getSales ~ error:', error);
      throw new Error('Something went wrong');
    }
  }

  async getSalesById(id: string) {
    try {
      return await this.salesRepository.findOne({
        where: { id },
        attributes: [
          'id',
          'order',
          'totalPrice',
          'shippedDate',
          'status',
          'quantity',
          'createdAt',
        ],
        include: [
          {
            model: Customer,
            attributes: ['id', 'name', 'email', 'phone', 'address'],
          },
          {
            model: Products,
            attributes: [
              'id',
              'name',
              'description',
              'price',
              'stock',
              'color',
            ],
            include: [
              {
                model: Sizes,
                attributes: ['id', 'value'],
              },
              {
                model: TypeProducts,
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: User,
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
    } catch (error) {
      console.log('-----> getSalesById ~ error:', error);
      throw new Error('Something went wrong');
    }
  }

  async updateSaleById(id: string, data: Partial<SalesOrder>) {
    try {
      return await this.salesRepository.update(data, { where: { id } });
    } catch (error) {
      console.log('-----> updateSaleById ~ error:', error);
      throw new Error('Something went wrong');
    }
  }

  async deleteSaleById(id: string) {
    try {
      const sale = await this.salesRepository.findOne({ where: { id } });
      if (sale.status === StatusOrder.SHIPPED) {
        throw new Error('Can not delete shipped sale');
      }
      return await this.salesRepository.destroy({ where: { id } });
    } catch (error) {
      console.log('-----> deleteSaleById ~ error:', error);
      throw new Error('Something went wrong');
    }
  }

  async createSale(data: Partial<SalesOrder>) {
    try {
      const product = await this.productsRepository.findOne({
        where: { id: data.productId },
      });
      if (product.stock < data.quantity) {
        throw new Error('Not enough stock');
      } else if (product.stock === 0) {
        throw new Error('Product out of stock');
      }

      product.stock -= data.quantity;

      const partialStringProduct = product.id.slice(
        product.id.length - 4,
        product.id.length,
      );

      const sale = await this.salesRepository.create({
        ...data,
        totalPrice: product.price * data.quantity,
        shippedDate: data.status === StatusOrder.SHIPPED ? new Date() : null,
        rejectedDate: data.status === StatusOrder.REJECTED ? new Date() : null,
        order: `SO-${new Date().getTime()}-${partialStringProduct}`,
      });

      await this.productsRepository.update(product, {
        where: { id: product.id },
      });

      return sale;
    } catch (error) {
      console.log('-----> createSale ~ error:', error);
      throw new Error('Something went wrong');
    }
  }
}
