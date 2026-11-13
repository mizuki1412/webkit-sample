/**
 * 设计语言注册表 —— antdv-next ConfigProvider 映射。
 *
 * 职责边界（对应 design/README.md 的四层流水线）：
 *   - design/themes/<id>/tokens.json 是唯一事实源（build.py 编译出 all-themes.css）；
 *   - 本文件只做「语义 token → antdv-next theme.token」的映射，不发明值；
 *     每个 token 值都能在对应 tokens.json 里找到（key 相同、值相同）。
 *
 * 新增设计语言：design/themes/<id>/tokens.json + 本文件加一条映射即可。
 */
import {theme} from "antdv-next"
import designsMeta from "../../design/themes/build/designs.json"

/** designs.json 的 meta（id/scheme/swatch/source）+ antd 映射，顺序即构建顺序。 */
const labels = {aurora: "Aurora · 蓝调活泼", noir: "Noir · 暗夜金融", porcelain: "Porcelain · 素瓷商务"}
export const designs = designsMeta.map((meta) =>
  Object.assign({}, meta, {label: labels[meta.id] || meta.id}))

const byId = Object.fromEntries(designs.map((d) => [d.id, d]))

/**
 * antd theme.token 映射。值均来自各主题 tokens.json 同名语义角色：
 *   colorPrimary=accent, colorBgLayout=bg, colorBgContainer=surface,
 *   colorBgElevated=surface-raised, colorBorder=border-strong, colorBorderSecondary=border,
 *   colorText=text, colorTextSecondary=text-muted, colorTextTertiary=text-faint,
 *   borderRadius=radius.md, borderRadiusLG=radius.lg, borderRadiusSM=radius.sm,
 *   controlHeight=layout.control-h, fontSize=font.size.base
 */
const antdTokens = {
  aurora: {
    colorPrimary: "#005EFD",
    colorInfo: "#005EFD",
    colorLink: "#005EFD",
    colorSuccess: "#2FBF71",
    colorWarning: "#F5A623",
    colorError: "#F25555",
    colorTextBase: "#253044",
    colorText: "#253044",
    colorTextSecondary: "#6B7A99",
    colorTextTertiary: "#9AA6BE",
    colorBgLayout: "#F0F3FA",
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FFFFFF",
    colorBorder: "#D5DCEC",
    colorBorderSecondary: "#E8ECF6",
    borderRadius: 14,
    borderRadiusLG: 20,
    borderRadiusSM: 10,
    controlHeight: 40,
    fontSize: 14,
  },
  noir: {
    colorPrimary: "#4972FE",
    colorInfo: "#4972FE",
    colorLink: "#4972FE",
    colorSuccess: "#3DD68C",
    colorWarning: "#E8B339",
    colorError: "#F0574F",
    colorTextBase: "#F4F3F7",
    colorText: "#F4F3F7",
    colorTextSecondary: "#9A94AC",
    colorTextTertiary: "#655F75",
    colorBgBase: "#131118",
    colorBgLayout: "#131118",
    colorBgContainer: "#1B1920",
    colorBgElevated: "#26232E",
    colorBorder: "rgba(255, 255, 255, 0.14)",
    colorBorderSecondary: "rgba(255, 255, 255, 0.08)",
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    controlHeight: 36,
    fontSize: 13,
  },
  porcelain: {
    colorPrimary: "#3A78F2",
    colorInfo: "#3A78F2",
    colorLink: "#3A78F2",
    colorSuccess: "#17A34A",
    colorWarning: "#F0A020",
    colorError: "#E5484D",
    colorTextBase: "#232E4E",
    colorText: "#232E4E",
    colorTextHeading: "#0B1B4D",
    colorTextSecondary: "#6E7891",
    colorTextTertiary: "#9AA3BA",
    colorBgLayout: "#E9EDF5",
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FFFFFF",
    colorBorder: "#C7D0E0",
    colorBorderSecondary: "#DDE3EE",
    borderRadius: 8,
    borderRadiusLG: 10,
    borderRadiusSM: 6,
    controlHeight: 34,
    fontSize: 13,
  },
}

/** 当前激活的设计（default = 第一套）。 */
export const defaultDesignId = designs[0]?.id || "aurora"

/**
 * ConfigProvider 的 :theme 值。
 * @param {string} id 设计语言 id
 * @returns {{algorithm: object, token: object}}
 */
export function antdThemeOf(id) {
  const entry = byId[id] || byId[defaultDesignId]
  return {
    algorithm: entry.scheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: antdTokens[entry.id] || {},
  }
}
