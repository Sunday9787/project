interface Options {
  key: string
}

interface PoiAroundOption {
  /**未选中的图标的路径。项目目录下的图标路径，支持相对路径 */
  iconPath?: string
  /** 选中的图标的路径。项目目录下的图标路径，支持相对路径 */
  iconPathSelected?: string
  /** 关键字 */
  querykeywords?: string
  /** 类型，参考：POI分类表 */
  querytypes?: string
  /** 经纬度坐标。为空时，基于当前位置进行地址解析。格式：'经度,纬度' */
  location?: string
  success?(data: unknown): void
  fail?(result: unknown): void
}

interface RegeoOption {
  /**未选中的图标的路径。项目目录下的图标路径，支持相对路径 */
  iconPath?: string
  /** 图标宽度。默认为图标实际宽度 */
  iconWidth?: number
  /** 图标高度。默认为图标实际高度 */
  iconHeight?: number
  /** 经纬度坐标，非必填。为空时，基于当前位置进行地址解析。格式：'经度,纬度' */
  location?: string
  success?(result: RegeoSuccessResult[]): void
  fail?(result: unknown): void
}

interface RegeocodeData {
  /** 国家 */
  country: string
  /** 地址所在的省份名 */
  province: string
  /** 地址所在的城市名 */
  city: string
  /** 城市编码 */
  citycode: string
  /** 地址所在的区 */
  district: string
  /** 街道 */
  street: string
  /** 门牌 */
  number: string
  /** 区域编码 */
  adcode: string
  /** 坐标点 */
  location: string
  /** 匹配级别 */
  level: string
}

interface RegeoSuccessResult {
  /** Marker 的 id，编号从 0 开始 */
  id: number
  /** Marker 的名称 */
  name: string
  /** Marker 的描述 */
  desc: string
  /** Marker 的纬度 */
  latitude: string
  /** Marker 的经度 */
  longitude: string
  /** 图标的路径 */
  iconPath: string
  /** 图标的高度 */
  height: number
  /** 图标的宽度 */
  width: number
  regeocodeData: RegeocodeData
}

export class AMapWX {
  constructor(options: Options)

  /**
   * 获取周边的POI
   *
   * querykeywords、location、querytypes 字段于 1.1.0 版本新增。
   */
  getPoiAround(option: PoiAroundOption): void
  getRegeo(option: RegeoOption): void
}
