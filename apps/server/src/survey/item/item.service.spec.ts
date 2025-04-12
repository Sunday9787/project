import { Test, TestingModule } from '@nestjs/testing'

import { SurveyItemService } from './item.service'

describe('DetailService', () => {
  let service: SurveyItemService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyItemService]
    }).compile()

    service = module.get<SurveyItemService>(SurveyItemService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
