<template>
  <a-dropdown placement="topRight" :trigger="['click']">
    <button class="ds-fab" title="切换设计语言" type="button">
      <span class="ds-swatch">
        <i v-for="(c, i) in currentDesign.swatch.slice(0, 3)" :key="i" :style="{background: c}"/>
      </span>
      <span class="ds-label">{{ currentDesign.label }}</span>
    </button>
    <template #popupRender>
      <div class="ds-menu">
        <div class="ds-menu-title">设计语言</div>
        <button
            v-for="d in designs"
            :key="d.id"
            type="button"
            class="ds-item"
            :class="{'is-active': d.id === designId}"
            @click="setDesign(d.id)">
          <span class="ds-swatch">
            <i v-for="(c, i) in d.swatch.slice(0, 3)" :key="i" :style="{background: c}"/>
          </span>
          <span class="ds-item-body">
            <span class="ds-item-label">{{ d.label }}</span>
            <span class="ds-item-source">{{ d.scheme }} · {{ d.source.split('/').pop().slice(0, 10) }}…</span>
          </span>
          <CheckOutlined v-if="d.id === designId" class="ds-check"/>
        </button>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup>
import {CheckOutlined} from "@antdv-next/icons"
import {useDesignTheme} from "./use-design-theme"

const {designs, designId, currentDesign, setDesign} = useDesignTheme()
</script>

<style scoped>
/* 全部走 all-themes.css 的语义变量，自身即跟随设计切换 */
.ds-fab {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 1100;
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--layout-control-h);
  padding: 0 var(--space-4);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-card);
  cursor: pointer;
}
.ds-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
.ds-swatch {
  display: inline-flex;
  flex-direction: column;
  width: 14px;
  height: 14px;
  border-radius: var(--radius-xs);
  overflow: hidden;
  border: 1px solid var(--color-border-strong);
  flex-shrink: 0;
}
.ds-swatch i {
  flex: 1;
}
.ds-menu {
  min-width: 220px;
  padding: var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
.ds-menu-title {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-micro);
  letter-spacing: var(--tracking-micro);
  color: var(--color-text-faint);
  text-transform: uppercase;
}
.ds-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
}
.ds-item:hover {
  background: var(--color-surface-raised);
}
.ds-item.is-active {
  background: var(--color-accent-weak);
}
.ds-item-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}
.ds-item-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
.ds-item.is-active .ds-item-label {
  color: var(--color-accent);
}
.ds-item-source {
  font-size: var(--font-size-micro);
  color: var(--color-text-faint);
}
.ds-check {
  color: var(--color-accent);
  font-size: var(--font-size-sm);
}
</style>
