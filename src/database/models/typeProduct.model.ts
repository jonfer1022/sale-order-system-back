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
import { Products } from '.';

@Table
export class TypeProducts extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  public id!: string;

  @Column(DataType.STRING)
  public name!: string;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;

  @HasMany(() => Products, 'typeId')
  public products!: Products[];
}
