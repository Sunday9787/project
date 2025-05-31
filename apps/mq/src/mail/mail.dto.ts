export class MailDTO {
  /** 接收方邮箱 */
  to: string
  /** 标题 */
  subject: string
  /** 文本 */
  text?: string
  /** 富文本，如果文本和富文本同时设置，富文本生效 */
  html?: string
}
