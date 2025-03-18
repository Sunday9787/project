import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QyHttpException, QyHttpStatus } from 'src/common/exception/http.exception'
import { QiyueQuery } from 'src/common/query'
import { UserService } from 'src/user/user.service'
import { Between, Like, Repository } from 'typeorm'

import { ProjectDTO, ProjectQueryDTO, ResponseProjectDTO } from './project.dto'
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
      relations: { survey: true, members: true, owner: true }
    })

    return plainToInstance(ResponseProjectDTO, data)
  }

  async save(data: ProjectDTO, tenant_id: string, payload: JwtPayload) {
    const entity = this.repository.create(data)
    const user = await this.userService.findById(payload.id)

    if (!user) {
      throw new QyHttpException('创建失败', QyHttpStatus.BAD_REQUEST)
    }

    entity.owner = user
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
        where: {
          tenant_id,
          name: query.keyword ? Like(`%${query.keyword}%`) : query.name ? Like(`%${query.name}%`) : void 0,
          client: query.keyword ? Like(`%${query.keyword}%`) : query.client ? Like(`%${query.client}%`) : void 0,
          create_at:
            query.create_at_start && query.create_at_end
              ? Between(new Date(query.create_at_start), new Date(query.create_at_end))
              : void 0
        },
        relations: { owner: true },
        order: query.order_by,
        ...qianliQuery.option
      })
      .then(function (result) {
        return qianliQuery.data(result)
      })
  }
}
