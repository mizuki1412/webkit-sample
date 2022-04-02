/**
 * Test a string with phone number Reg.
 * @param phone
 */
export function regexPhone(phone) {
  return /^1[34578]\d{9}$/.test(phone)
}

export function regexIP(ip) {
  return /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/.test(
    ip
  )
}
