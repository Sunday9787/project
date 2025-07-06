export enum PrjHttpStatus {
  USER_NOT_FOUND = 1000,
  USER_PASSWORD_WRONG = 1001,
  USER_TOKEN_INVALID = 1002,
  USER_REFRESH_TOKEN_INVALID = 1003,
  USER_EXISTED = 1004,
  TENANT_ID_NOT_FOUND = 1005,
  BAD_REQUEST = 0,
  OK_REQUEST = 200
}

export enum UserRole {
  /** 组织负责人 */
  admin = 0,
  /** 项目负责人 */
  owner = 1,
  /** 勘查员 */
  surveyor = 2
}

export enum ProjectStatus {
  /** 未保全 */
  start = -1,
  /** 保全中 */
  pending = 0,
  /** 保全完成 */
  complete = 1
}

/** 保全状态 */
export enum SurveyStatus {
  /** 未保全 */
  start = -1,
  /** 保全中 */
  pending = 0,
  /** 保全完成 */
  complete = 1
}

/**
 * 房屋结构
 */
export enum StructureType {
  /** 现浇框架结构 */
  castInPlaceFrameStructure = 0,
  /** 钢混结构 */
  steelConcreteStructure = 1,
  /** 砖混结构 */
  brickConcreteStructure = 2
}

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
