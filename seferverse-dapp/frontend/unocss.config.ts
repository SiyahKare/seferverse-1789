import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  shortcuts: [
    ['bg-glass', 'bg-white/10 backdrop-blur-md'],
    ['border-gradient', 'border-2 border-transparent bg-clip-padding border-gradient-to-r from-violet-500 to-blue-500'],
    ['icon-btn', 'inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition p-1'],
  ],
  theme: {
    fontFamily: {
      sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    },
  },
});