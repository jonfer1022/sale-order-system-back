import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Customer, Products, User } from '.';
import { StatusOrder } from '../../common/utils/enums';

@Table
export class SalesOrder extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  public id!: string;

  @ForeignKey(() => Customer)
  @Column(DataType.STRING)
  public customerId!: string;

  @BelongsTo(() => Customer)
  public customer!: Customer;

  @ForeignKey(() => Products)
  @Column(DataType.STRING)
  public productId!: string;

  @BelongsTo(() => Products)
  public product!: Products;

  @Column(DataType.INTEGER)
  public quantity!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public shippedDate?: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public rejectedDate?: Date | null;

  @Column(DataType.STRING)
  public order!: string;

  @Column(DataType.INTEGER)
  public totalPrice!: number;

  @Column(DataType.ENUM(...Object.values(StatusOrder)))
  public status!: StatusOrder;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  public registeredBy!: string;

  @BelongsTo(() => User)
  public user!: User;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;
}
