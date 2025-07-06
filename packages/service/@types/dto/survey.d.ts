declare namespace Service {
  /**
   * 保全状态
   */
  enum SurveyStatus {
    /** 未保全 */
    start = -1,
    /** 保全中 */
    pending = 0,
    /** 保全完成 */
    complete = 1
  }

  /**
   * 结构类型
   */
  enum SurveyStructure {
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
  enum SurveyPurposeHouse {
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

  interface ResponseSurveyDTO extends ResponseBaseDTO {
    owner: string
    id_card: string
    distance: number
    location: string
    structure_type: SurveyStructure
    number_of_floors: number
    purpose_house: SurveyPurposeHouse
    building_construction_date: number | null
    building_area: number
    preservation_date: number | null
    building_img: string
    property_certificate_img: string | null
    property_plan_img: string | null
    owner_signature_img: string
    status: SurveyStatus
    project_id: number
  }

  interface ResponseSurveyItemDTO extends ResponseBaseDTO {
    damaged_part: string
    desc: string
    img: string
    remark: string
  }
}
