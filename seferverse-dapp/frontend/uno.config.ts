import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  theme: {
    // You can customize your theme here
  },
  shortcuts: [
    // Example: glassmorphic card shortcut
    [
      'glass-card',
      'backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl',
    ],
  ],
});
