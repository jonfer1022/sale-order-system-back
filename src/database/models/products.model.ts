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
import { Sizes, TypeProducts } from '.';
import { Colors } from '../../common/utils/enums';

@Table({
  tableName: 'Products',
  schema: 'public',
})
export class Products extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  public id!: string;

  @Column(DataType.STRING)
  public name!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  public description?: string | null;

  @Column(DataType.INTEGER)
  public price!: number;

  @Column(DataType.INTEGER)
  public stock!: number;

  @Column({
    type: DataType.ENUM(...Object.values(Colors)),
  })
  public color!: Colors;

  @ForeignKey(() => TypeProducts)
  @Column(DataType.STRING)
  public typeId!: string;

  @ForeignKey(() => Sizes)
  @Column(DataType.STRING)
  public sizeId!: string;

  @BelongsTo(() => TypeProducts)
  public type!: TypeProducts;

  @BelongsTo(() => Sizes)
  public size!: Sizes;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;
}
