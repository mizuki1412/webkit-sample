// 实时保存当前路由对象
import {reactive} from 'vue';

export const storeCurrentRoute = reactive({
  name: 'index',
  path: '/',
  meta: undefined,
  query: undefined,
  params: undefined
});

export function updateStoreCurrentRoute(route) {
  storeCurrentRoute.meta = route.meta;
  storeCurrentRoute.name = route.name;
  storeCurrentRoute.path = route.path;
  storeCurrentRoute.query = route.query;
  storeCurrentRoute.params = route.params;
}
