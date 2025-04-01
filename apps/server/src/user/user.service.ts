import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QyHttpException, QyHttpStatus } from 'src/common/exception/http.exception'
import { QiyueQuery } from 'src/common/query'
import { md5 } from 'src/tools'
import { Between, Like, Repository } from 'typeorm'

import { ResponseUserDTO, UserDTO, UserForgetDTO, UserQueryDTO } from './user.dto'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
  static readonly DEFAULT_USER_PASSWORD = '123456789'
  constructor(@InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>) {}

  async save(data: UserDTO, tenant_id: string) {
    const entity = this.repository.create(data)
    entity.tenant_id = tenant_id

    if (entity.id === 0) {
      const user = await this.repository.findOne({ where: { phone: entity.phone } })

      if (user) {
        throw new QyHttpException('手机号已注册', QyHttpStatus.USER_EXISTED)
      }
    }

    entity.password = md5(UserService.DEFAULT_USER_PASSWORD)
    await this.repository.save(entity)
  }

  async del(id: number, tenant_id: string) {
    await this.repository.delete({ id, tenant_id })
  }

  findByPhone(phone: string) {
    return this.repository.findOne({
      where: { phone },
      select: ['id', 'tenant_id', 'avatar', 'nickname', 'phone', 'password', 'create_at', 'update_at']
    })
  }

  findById(id: number) {
    return this.repository.findOneBy({ id })
  }

  async forget(data: UserForgetDTO, tenant_id: string) {
    await this.repository.update({ id: data.id, tenant_id }, { password: md5(data.password) })
  }

  all(query: UserQueryDTO, tenant_id: string) {
    const qianliQuery = new QiyueQuery(query, function (entity: UserEntity) {
      return plainToInstance(ResponseUserDTO, entity, { excludeExtraneousValues: true })
    })

    return this.repository
      .findAndCount({
        where: {
          tenant_id,
          nickname: query.nickname ? Like(`%${query.nickname}`) : void 0,
          phone: query.phone ? Like(`%${query.phone}`) : void 0,
          role: query.role,
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

  cache() {
    return this.repository.find().then(function (entity) {
      return plainToInstance(ResponseUserDTO, entity)
    })
  }
}
