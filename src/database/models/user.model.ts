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
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  public id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  public name!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  public email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public passHash!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public hashRt?: string | null;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;

  @HasMany(() => SalesOrder, 'registeredBy')
  public salesOrders!: SalesOrder[];
}
