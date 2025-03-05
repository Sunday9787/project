import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import type { FindManyOptions } from 'typeorm'

export type QueryOrderByDTO<T> = { [K in keyof T]?: 'asc' | 'desc' }

class BaseQueryDTO {
  @IsOptional()
  @IsInt()
  create_at_start?: number

  @IsOptional()
  @IsInt()
  create_at_end?: number
}

export class ListDTO<T> {
  size: number
  current: number
  total: number
  list: T[]
}

export class ListQueryDTO extends BaseQueryDTO {
  @IsNumber()
  size: number

  @IsNumber()
  current: number

  @IsOptional()
  @IsString()
  keyword?: string

  constructor(size: number = 10, current: number = 1) {
    super()
    this.size = size
    this.current = current
  }
}

export class QiyueQuery<T, D, Q extends ListQueryDTO> {
  private readonly result: ListDTO<D>
  public readonly option: Pick<FindManyOptions<T>, 'skip' | 'take'>

  constructor(
    private readonly query: Q,
    private readonly handle: (item: T) => D
  ) {
    this.option = { take: query.size, skip: query.size * (query.current - 1) }
    this.result = new ListDTO()
  }

  public data([result, total]: [Array<T>, number]) {
    this.result.current = this.query.current
    this.result.size = this.query.size
    this.result.total = total
    this.result.list = result.map(this.handle)

    return this.result
  }
}
