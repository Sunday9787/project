import { IsNumber, IsOptional, IsString } from 'class-validator'
import type { FindManyOptions } from 'typeorm'

import { BaseQueryDTO } from './base.dto'

export class ListDTO<T> {
  size: number
  current: number
  total: number
  list: T[]
}

export class ListQueryDTO<T> extends BaseQueryDTO<T> {
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

export class QiyueQuery<T, D, Q extends ListQueryDTO<T>> {
  private readonly result: ListDTO<D>
  public readonly option: Pick<FindManyOptions<T>, 'skip' | 'take' | 'order'>

  constructor(
    private readonly query: Q,
    private readonly handle: (item: T) => D
  ) {
    this.option = { take: query.size, order: query.order_by, skip: query.size * (query.current - 1) }
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
