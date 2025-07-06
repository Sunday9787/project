import { type ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer'
import { toRaw } from 'vue'

const valueWeakMap = new WeakMap<AbstractEntity, AbstractEntity>()

export abstract class AbstractEntity {
  public static async wrapper<T>(context: ClassConstructor<T>, Result: Promise<T>): Promise<T>
  public static async wrapper<T>(context: ClassConstructor<T>, Result: Promise<T[]>): Promise<T[]>
  public static async wrapper<T>(context: ClassConstructor<T>, Result: Promise<T | T[]>): Promise<T | T[]> {
    const response = await Result

    return plainToInstance(context, response, { exposeDefaultValues: true })
  }

  public static async wrapperList<T>(context: ClassConstructor<T>, Result: Promise<AppResponse.List<T>>) {
    const response = await Result
    response.list = plainToInstance(context, response.list, { exposeDefaultValues: true })
    return response
  }

  public static toJSON<T extends object>(context: T) {
    return instanceToPlain(context, { strategy: 'excludeAll' }) as T
  }

  constructor() {
    const self = this
    setTimeout(function () {
      valueWeakMap.set(self, self.toJSON())
    })
  }

  public reset() {
    const context = toRaw(this)
    const data = valueWeakMap.get(context)!
    for (const [key, value] of Object.entries(data)) {
      ;(this as Record<string, unknown>)[key] = value
    }
  }

  public toJSON() {
    return AbstractEntity.toJSON(this)
  }
}

export abstract class AbstractService {
  abstract readonly baseURL: string
}
