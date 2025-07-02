import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { firstValueFrom, timeout } from 'rxjs'
import { BaseDTO } from 'src/common/base.dto'
import { PrjHttpException, PrjHttpStatus } from 'src/common/exception/http.exception'
import { PrjQuery } from 'src/common/query'
import { RedisService } from 'src/redis/redis.service'
import { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'
import { Between, Like, Repository } from 'typeorm'

import { ProjectBaseDTO, ProjectQueryDTO, RenderProjectDocDTO, ResponseProjectDTO } from './project.dto'
import { ProjectEntity } from './project.entity'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private readonly repository: Repository<ProjectEntity>,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject('MQ_SERVICE') private readonly mq: ClientProxy
  ) {}

  async generateProjectCode() {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '') // 20250420

    // 使用 Redis 全局自增计数器
    const serial = await this.redisService.redis.incr('project:serial')

    const padded = serial.toString().padStart(4, '0')
    return `PRJ-${dateStr}-${padded}`
  }

  async exportDoc(id: number, tenant_id: string): Promise<[string, Buffer]> {
    const entity = await this.repository.findOne({
      where: { id, tenant_id },
      relations: { members: true, surveys: { item: true }, owner: true },
      order: {
        create_at: 'ASC',
        surveys: { item: { create_at: 'ASC' } }
      }
    })

    if (!entity) {
      throw new PrjHttpException('项目不存在', PrjHttpStatus.BAD_REQUEST)
    }

    const data = plainToInstance(RenderProjectDocDTO, entity)
    const result$ = this.mq.send<ReturnType<Buffer['toJSON']>>('export', data).pipe(timeout(20000))
    const result = await firstValueFrom(result$)

    return [data.name, Buffer.from(result.data)]
  }

  async detail(id: number, tenant_id: string) {
    const data = await this.repository.findOne({
      where: {
        id,
        tenant_id
      },
      relations: { members: true, owner: true }
    })

    if (!data) {
      throw new PrjHttpException('项目不存在', PrjHttpStatus.BAD_REQUEST)
    }

    return plainToInstance(ResponseProjectDTO, data, { strategy: 'excludeAll' })
  }

  async save(data: ProjectBaseDTO, members: BaseDTO[], tenant_id: string, payload: JwtPayload) {
    const entity = this.repository.create(data)
    const user = await this.userService.findById(payload.id, tenant_id)
    if (!user) {
      throw new PrjHttpException('保存失败:创建人不存在', PrjHttpStatus.BAD_REQUEST)
    }

    const result = await Promise.all(members.map(item => this.userService.findById(item.id, tenant_id)))

    if (result.some(item => !item)) {
      throw new PrjHttpException('保存失败:成员不存在', PrjHttpStatus.BAD_REQUEST)
    }

    // 如果id > 0 则是更新 否则 生成 项目编号
    if (!entity.id) {
      entity.code = await this.generateProjectCode()
    }

    entity.owner = user
    entity.members = result as UserEntity[]
    entity.tenant_id = tenant_id
    await this.repository.save(entity)
  }

  async del(id: number, tenant_id: string) {
    await this.repository.delete({ id, tenant_id })
  }

  all(query: ProjectQueryDTO, tenant_id: string) {
    const prjQuery = new PrjQuery(query, function (entity: ProjectEntity) {
      return plainToInstance(ResponseProjectDTO, entity, { strategy: 'excludeAll' })
    })

    return this.repository
      .findAndCount({
        where: query.keyword
          ? [
              { tenant_id, name: Like(`%${query.keyword}%`) },
              { tenant_id, client: Like(`%${query.keyword}%`) }
            ]
          : {
              tenant_id,
              name: query.name ? Like(`%${query.name}%`) : void 0,
              client: query.client ? Like(`%${query.client}%`) : void 0,
              create_at:
                query.create_at_start && query.create_at_end
                  ? Between(new Date(query.create_at_start), new Date(query.create_at_end))
                  : void 0
            },
        relations: {
          owner: true,
          members: true
        },
        order: query.order_by,
        ...prjQuery.option
      })
      .then(function (result) {
        return prjQuery.data(result)
      })
  }
}
