import { IsInt, Min } from 'class-validator'
import type { FindManyOptions } from 'typeorm'

import { QueryBaseDTO } from './base.dto'

export class ListDTO<T> {
  size: number
  current: number
  total: number
  list: T[]
}

export class ListQueryDTO extends QueryBaseDTO {
  @Min(1)
  @IsInt()
  size: number

  @Min(1)
  @IsInt()
  current: number

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
