import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { BaseDTO } from 'src/common/base.dto'
import { QyHttpException, QyHttpStatus } from 'src/common/exception/http.exception'
import { QiyueQuery } from 'src/common/query'
import { DocService } from 'src/doc/doc.service'
import { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'
import { Between, Like, Repository } from 'typeorm'

import { ProjectBaseDTO, ProjectQueryDTO, ResponseProjectDTO } from './project.dto'
import { ProjectEntity } from './project.entity'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private readonly repository: Repository<ProjectEntity>,
    @Inject(UserService) private readonly userService: UserService
  ) {}

  async detail(id: number, tenant_id: string) {
    const data = await this.repository.findOne({
      where: {
        id,
        tenant_id
      },
      select: {
        members: { id: true }
      },
      relations: { members: true }
    })

    return plainToInstance(ResponseProjectDTO, data)
  }

  async save(data: ProjectBaseDTO, members: BaseDTO[], tenant_id: string, payload: JwtPayload) {
    const entity = this.repository.create(data)
    const user = await this.userService.findById(payload.id)
    if (!user) {
      throw new QyHttpException('创建失败:创建人不存在', QyHttpStatus.BAD_REQUEST)
    }

    const result = await Promise.all(members.map(item => this.userService.findById(item.id)))

    if (result.some(item => !item)) {
      throw new QyHttpException('创建失败:成员不存在', QyHttpStatus.BAD_REQUEST)
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
    const qianliQuery = new QiyueQuery(query, function (entity: ProjectEntity) {
      return plainToInstance(ResponseProjectDTO, entity)
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
        order: query.order_by,
        ...qianliQuery.option
      })
      .then(function (result) {
        return qianliQuery.data(result)
      })
  }
}
