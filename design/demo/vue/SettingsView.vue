<script setup>
// Design-language demo: a Settings screen built ONLY from design/out tokens.
// This file is illustrative — it shows how a real view consumes the language
// in the webkit-sample stack (Vue 3 + Tailwind CSS 4 + antdv). It uses the
// generated utility classes (bg-surface, text-text-faint, rounded-[16px] …),
// never raw colors or px. The same screen rendered to PNG lives at
// design/demo/vue/settings.png (rendered from settings.cdn.html).
import { ref } from "vue"

const prefs = ref({ weekly: true, alerts: true, hide: false })
const devices = [
  { name: "MacBook Pro", meta: "San Francisco · current session" },
  { name: "iPhone 16", meta: "San Francisco · 2 hours ago" },
]
</script>

<template>
  <!-- app shell: 232px sidebar + 1fr, exactly like the source UI -->
  <div class="grid grid-cols-[232px_minmax(0,1fr)] bg-bg text-text min-h-screen">
    <!-- sidebar -->
    <aside class="border-r border-border p-6 flex flex-col">
      <div class="flex items-center gap-2.5 px-2 pb-6">
        <div class="w-[26px] h-[26px] rounded-[8px] bg-accent text-accent-ink grid place-items-center font-bold">V</div>
        <span class="text-[15px] font-bold tracking-[0.14em]">VOLT</span>
      </div>
      <nav class="flex flex-col gap-1">
        <a class="flex items-center gap-3 h-10 px-3 rounded-[10px] text-text-muted">Overview</a>
        <a class="flex items-center gap-3 h-10 px-3 rounded-[10px] bg-surface-raised text-text">Settings</a>
      </nav>
      <div class="mt-auto border border-border bg-surface rounded-[14px] p-4">
        <b class="block text-sm font-semibold">Volt Pro</b>
        <p class="mt-1 mb-3 text-xs leading-normal text-text-faint">Renews Dec 1 · 0 fees on your first $50k.</p>
        <a class="block text-center border border-border text-text-muted rounded-[8px] py-2 text-xs font-semibold">Manage plan</a>
      </div>
    </aside>

    <!-- main -->
    <div class="flex flex-col min-w-0">
      <header class="h-16 flex items-center gap-3 px-8 border-b border-border">
        <div class="flex items-center gap-2 w-[280px] h-9 bg-surface-raised border border-border rounded-[10px] px-3 text-text-faint text-sm">Search settings…</div>
        <div class="ml-auto flex items-center gap-3">
          <span class="text-xs text-text-faint inline-flex items-center gap-2"><i class="w-1.5 h-1.5 rounded-full bg-positive"></i>All changes saved</span>
          <div class="w-9 h-9 rounded-full bg-surface-raised border border-border grid place-items-center text-sm font-semibold text-text-muted">AK</div>
          <button class="h-9 px-4 rounded-[10px] bg-accent text-accent-ink text-sm font-bold">Save changes</button>
        </div>
      </header>

      <main class="p-6 flex flex-col gap-5">
        <div class="flex items-end justify-between">
          <div>
            <h1 class="m-0 text-[25px] leading-tight tracking-[-0.01em] font-semibold">Settings</h1>
            <p class="mt-1 mb-0 text-sm text-text-faint">Manage your profile, preferences and account security.</p>
          </div>
        </div>

        <div class="grid grid-cols-[minmax(0,1fr)_360px] gap-6">
          <div class="flex flex-col gap-6">
            <!-- profile card -->
            <section class="bg-surface border border-border rounded-[16px] p-6">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full bg-surface-raised border border-border grid place-items-center text-lg font-semibold text-text-muted">AK</div>
                <div>
                  <h3 class="m-0 text-lg font-semibold">Alex Kim</h3>
                  <p class="m-0 text-sm text-text-faint">alex@volt.finance</p>
                  <span class="inline-flex items-center h-[22px] px-2 mt-2 rounded-full bg-accent-weak text-accent text-[10.5px] font-bold tracking-[0.04em] uppercase">Pro member</span>
                </div>
                <button class="ml-auto h-9 px-3 border border-border rounded-[10px] bg-transparent text-text-muted text-xs font-semibold">Edit profile</button>
              </div>
            </section>

            <!-- preferences -->
            <section class="bg-surface border border-border rounded-[16px] p-6">
              <div class="flex items-center justify-between mb-4"><h2 class="m-0 text-base font-semibold">Preferences</h2><span class="text-xs text-text-faint">3 enabled</span></div>
              <div class="flex flex-col">
                <div v-for="(v, k, i) in prefs" :key="k" class="flex items-center gap-4 py-4" :class="i ? 'border-t border-border' : ''">
                  <div class="flex-1">
                    <b class="block text-sm font-semibold">{{ {weekly:'Weekly portfolio report', alerts:'Price alerts', hide:'Hide balances'}[k] }}</b>
                    <small class="block mt-0.5 text-xs leading-normal text-text-faint">{{ {'weekly':'A summary every Monday at 09:00, delivered by email.','alerts':'Notify me when a held asset moves more than 5% in 24h.','hide':'Blur portfolio values until you hover over them.'}[k] }}</small>
                  </div>
                  <div class="w-[34px] h-5 rounded-full relative" :class="v ? 'bg-accent' : 'bg-data-3'">
                    <span class="absolute top-[3px] w-[14px] h-[14px] rounded-full bg-accent-ink" :class="v ? 'right-[3px]' : 'left-[3px]'"></span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- right column -->
          <aside class="flex flex-col gap-6">
            <section class="bg-surface border border-border rounded-[16px] p-6">
              <div class="flex items-center justify-between mb-2"><h2 class="m-0 text-base font-semibold">Plan</h2><span class="inline-flex items-center h-[22px] px-2 rounded-full bg-surface-raised text-text-muted text-[10.5px] font-bold">PRO</span></div>
              <div class="flex items-baseline gap-2 my-2"><b class="text-[25px] leading-tight tracking-[-0.01em] font-semibold">$12</b><small class="text-xs text-text-faint">/ month</small></div>
              <p class="m-0 mb-4 text-xs text-text-faint">Billed annually · next charge Dec 1, 2026</p>
              <div class="flex gap-2">
                <button class="h-9 px-4 border border-border rounded-[10px] bg-transparent text-text text-xs font-semibold">Manage plan</button>
                <button class="h-9 px-3 border-0 bg-transparent text-text-muted text-xs">Billing history</button>
              </div>
            </section>

            <section class="bg-surface border border-border rounded-[16px] p-6">
              <div class="flex items-center justify-between mb-2"><h2 class="m-0 text-base font-semibold">Devices</h2><span class="text-xs text-text-faint">2 active</span></div>
              <div v-for="(d, i) in devices" :key="d.name" class="flex items-start gap-3 py-3" :class="i ? 'border-t border-border' : ''">
                <div class="w-[30px] h-[30px] rounded-[8px] bg-surface-raised border border-border grid place-items-center text-text-muted flex-none"></div>
                <div><b class="block text-sm font-semibold">{{ d.name }}</b><small class="block mt-0.5 text-[10.5px] text-text-faint">{{ d.meta }}</small></div>
                <button class="ml-auto h-7 px-2 border-0 bg-transparent text-text-muted text-xs font-semibold">Sign out</button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>
