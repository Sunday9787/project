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
