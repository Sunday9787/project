/**
 * 结构类型
 */
export enum SurveyStructure {
  /** 现浇框架结构 */
  castInPlaceFrameStructure = 0,
  /** 钢混结构 */
  steelConcreteStructure = 1,
  /** 砖混结构 */
  brickConcreteStructure = 2
}

export const surveyStructureMap = new Map([
  [SurveyStructure.castInPlaceFrameStructure, '现浇框架结构'],
  [SurveyStructure.steelConcreteStructure, '钢混结构'],
  [SurveyStructure.brickConcreteStructure, '砖混结构']
])

export enum SurveyStatus {
  /** 未保全 */
  start = -1,
  /** 保全中 */
  pending = 0,
  /** 保全完成 */
  complete = 1
}

export const surveyStatusMap = new Map([
  [SurveyStatus.start, '未保全'],
  [SurveyStatus.pending, '保全中'],
  [SurveyStatus.complete, '保全完成']
])

/**
 * 房屋用途
 */
export enum SurveyPurposeHouse {
  /** 仓房 */
  plant = 0,
  /** 仓库 */
  warehouse = 1,
  /** 商业用房 */
  business = 2,
  /** 服务业用房 */
  service = 3,
  /** 办公室 */
  office = 4,
  /** 住宅 */
  residence = 5,
  /** 教育用房 */
  school = 6,
  /** 文化用房 */
  culture = 7,
  /** 医疗用房 */
  hospital = 8,
  /** 科学实验研究用房 */
  science = 9,
  /** 其他 */
  other = 10
}

export const surveyPurposeHouseMap = new Map([
  [SurveyPurposeHouse.plant, '仓房'],
  [SurveyPurposeHouse.warehouse, '仓库'],
  [SurveyPurposeHouse.business, '商业用房'],
  [SurveyPurposeHouse.service, '服务业用房'],
  [SurveyPurposeHouse.office, '办公室'],
  [SurveyPurposeHouse.residence, '住宅'],
  [SurveyPurposeHouse.school, '教育用房'],
  [SurveyPurposeHouse.culture, '文化用房'],
  [SurveyPurposeHouse.hospital, '医疗用房'],
  [SurveyPurposeHouse.science, '科学实验研究用房'],
  [SurveyPurposeHouse.other, '其他']
])
