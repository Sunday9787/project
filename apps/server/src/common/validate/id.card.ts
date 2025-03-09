import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ async: false })
export class IsChineseIDCardConstraint implements ValidatorConstraintInterface {
  validate(idCard: string) {
    if (typeof idCard !== 'string' || !/^\d{17}[\dXx]$/.test(idCard)) {
      return false
    }

    // 解析身份证号为数组，前 17 位转换为数字
    const digits = idCard
      .toUpperCase()
      .split('')
      .map((char, index) => (index < 17 ? parseInt(char, 10) : char))

    // 确保前 17 位都是有效数字
    if (digits.slice(0, 17).some(isNaN)) {
      return false
    }

    // 计算校验码
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

    // 计算加权和
    const sum = digits
      .slice(0, 17)
      .reduce((acc: number, digit: number, index: number) => acc + digit * weights[index], 0) as number

    // 计算校验码
    const expectedCheckCode = checkCodes[sum % 11]

    return digits[17] === expectedCheckCode
  }

  defaultMessage() {
    return '身份证号码格式不正确'
  }
}

export function IsChineseIDCard(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsChineseIDCardConstraint
    })
  }
}
