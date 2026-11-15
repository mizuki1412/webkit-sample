/**
 * 设计语言切换 composable —— 全链路的最后一环：
 *
 *   原图(assets) → tokens.json(设计语言) → build.py → CSS 变量
 *     → <html data-design="<id>">（CSS 级联生效）
 *     → antdThemeOf(id)（antdv-next 组件跟随）
 *     → localStorage 持久化
 *
 * 用法：
 *   const {designs, designId, setDesign, designTheme} = useDesignTheme()
 *   <a-config-provider :theme="designTheme"> ... <design-switcher/>
 */
import {computed, ref, watchEffect} from "vue"
import {antdThemeOf, defaultDesignId, designs} from "./registry"

const STORAGE_KEY = "webkit.design"

function initialId() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return designs.some((d) => d.id === saved) ? saved : defaultDesignId
}

const designId = ref(initialId())

// data-design 挂在 <html> 上：themes.css 的变量级联 + adapter.css 覆盖层都依赖它。
watchEffect(() => {
  document.documentElement.dataset.design = designId.value
})

/** ConfigProvider 受控 theme（换设计时整站 antd 组件即时重渲染）。 */
const designTheme = computed(() => antdThemeOf(designId.value))

/** 当前设计的 meta（label/scheme/swatch，供切换器展示）。 */
const currentDesign = computed(() => designs.find((d) => d.id === designId.value))

/** 切换设计语言并持久化。 */
function setDesign(id) {
  if (!designs.some((d) => d.id === id)) return
  designId.value = id
  localStorage.setItem(STORAGE_KEY, id)
}

export function useDesignTheme() {
  return {designs, designId, currentDesign, designTheme, setDesign}
}
