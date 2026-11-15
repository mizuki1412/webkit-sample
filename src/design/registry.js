/**
 * 设计语言 antd 映射（Lumen 单语言）。
 *
 * 值全部来自 design/lang/DESIGN.md 的 antd 映射表（语言事实源 design/lang/tokens.json）；
 * $scheme = light → defaultAlgorithm。
 */
import {theme} from "antdv-next"

export const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#3A78F2",
    colorInfo: "#3A78F2",
    colorLink: "#3A78F2",
    colorSuccess: "#0EA129",
    colorWarning: "#C6792A",
    colorError: "#E5484D",
    colorTextBase: "#151827",
    colorText: "#151827",
    colorTextSecondary: "#939AB1",
    colorTextTertiary: "#B4BCD0",
    colorBgLayout: "#DDE4EF",
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FFFFFF",
    colorBorder: "#B9C3DA",
    colorBorderSecondary: "#D1D8E8",
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    controlHeight: 40,
    fontSize: 14,
  },
}
