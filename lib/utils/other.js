
export function passwordCheck(rule, value, callback) {
  if (!value && (modalReg.value.pwd !== '' )) {
    callback(new Error('请再次输入密码'));
  } else if (value !== modal.value.pwd) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
}
