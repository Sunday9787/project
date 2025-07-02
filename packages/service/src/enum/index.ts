export enum PrjHttpStatus {
  USER_NOT_FOUND = 1000,
  USER_PASSWORD_WRONG = 1001,
  USER_TOKEN_INVALID = 1002,
  USER_REFRESH_TOKEN_INVALID = 1003,
  USER_EXISTED = 1004,
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
