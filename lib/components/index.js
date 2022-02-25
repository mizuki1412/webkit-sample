
// todo 使用component时，全局注册组件中所有依赖的组件，那么在外部工程中即可用on-demand
// todo unplugin-vue-components resolver
export const WebkitUnpluginResolver = (name) => {
  // where `name` is always CapitalCase
  if (name.startsWith('Kit')){
    console.log(name)
  }
    // return { importName: name.slice(3), path: '/lib/components' }
}
