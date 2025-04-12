import { Test, TestingModule } from '@nestjs/testing'

import { SurveyDetailController } from './item.controller'

describe('DetailController', () => {
  let controller: SurveyDetailController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyDetailController]
    }).compile()

    controller = module.get<SurveyDetailController>(SurveyDetailController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
