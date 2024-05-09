import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { SalesOrder } from '.';

@Table
export class Customer extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  public id!: string;

  @Column(DataType.STRING)
  public name!: string;

  @Column(DataType.STRING)
  public email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public phone?: string | null;

  @Column(DataType.STRING)
  public address!: string;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;

  @HasMany(() => SalesOrder, 'registeredBy')
  public salesOrders!: SalesOrder[];
}
