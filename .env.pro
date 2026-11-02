# 生产环境走同源部署（nginx/网关把 /api 反代到 go-frame），不再直连 localhost。
# 反代目标配置 rest.base 后，路径为 /server；未配置则为根路径。
VITE_REQUEST_BASE_URL=/api
