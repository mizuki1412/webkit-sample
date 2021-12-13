# pc

## bridge的使用

demo:
```js
// bridge; router中需要query=port，将port传入init
init(router.currentRoute.query.port?parseInt(router.currentRoute.query.port):8000)

// 添加数据接收逻辑处理
addHandler("monitor-data", function (msg){
  console.log(msg)
})
```
