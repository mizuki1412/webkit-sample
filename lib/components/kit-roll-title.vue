<template>
  <div class="marquee w-full">
    <div class="marquee-wrap">
      <div class="marquee-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.marquee {
  overflow: hidden;
}

.marquee .marquee-wrap {
  width: 100%;
  animation: marquee-wrap 4s infinite linear;
}

.marquee .marquee-content {
  float: left;
  white-space: nowrap;
  min-width: 100%;
  animation: marquee-content 4s infinite linear;
}

@keyframes marquee-wrap {
  0%,
  30% {
    transform: translateX(0);
  }

  70%,
  100% {
    transform: translateX(100%);
  }
}

@keyframes marquee-content {
  0%,
  30% {
    transform: translateX(0);
  }

  70%,
  100% {
    transform: translateX(-100%);
  }
}
</style>
