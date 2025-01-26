module.exports = {
  content: ['./index.html', './src/**/*.{html,vue,js,ts,jsx,tsx}','./lib/**/*.{html,vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  corePlugins:{
    // 去掉默认配置，这里配合使用了antdv的reset.css
    preflight: false
  }
}
