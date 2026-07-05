/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Neutral Scale (cool gray with blue tint)
        neutral: {
          0:   '#FFFFFF',
          50:  '#F5F9FF',
          100: '#EDF2FA',
          200: '#E1E8F2',
          300: '#CDD5E2',
          400: '#A1A9B8',
          500: '#747D92',
          600: '#555D70',
          700: '#3A4054',
          800: '#222638',
          900: '#131620',
        },
        // AI专属色
        ai: {
          light: '#EEF1FF',
          glow:  '#7B93FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'HarmonyOS Sans SC', 'Microsoft YaHei', 'Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs':   ['12px', { lineHeight: '1.5' }],
        'sm':   ['14px', { lineHeight: '1.5' }],
        'base': ['16px', { lineHeight: '1.6' }],
        'lg':   ['18px', { lineHeight: '1.6' }],
        'xl':   ['20px', { lineHeight: '1.5' }],
        '2xl':  ['24px', { lineHeight: '1.4' }],
        '3xl':  ['30px', { lineHeight: '1.3' }],
        '4xl':  ['38px', { lineHeight: '1.2' }],
        '5xl':  ['48px', { lineHeight: '1.1' }],
      },
      spacing: {
        '0':   '0',
        '1':   '4px',
        '2':   '8px',
        '3':   '12px',
        '4':   '16px',
        '5':   '20px',
        '6':   '24px',
        '8':   '32px',
        '10':  '40px',
        '12':  '48px',
        '16':  '64px',
        '20':  '80px',
        '24':  '96px',
      },
      borderRadius: {
        'xs':   '4px',
        'sm':   '6px',
        'md':   '10px',
        'lg':   '14px',
        'xl':   '20px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(19, 22, 54, 0.04), 0 1px 3px rgba(19, 22, 54, 0.06)',
        'md': '0 2px 4px rgba(19, 22, 54, 0.04), 0 4px 12px rgba(19, 22, 54, 0.08)',
        'lg': '0 4px 8px rgba(19, 22, 54, 0.04), 0 8px 24px rgba(19, 22, 54, 0.12)',
        'xl': '0 8px 16px rgba(19, 22, 54, 0.04), 0 16px 48px rgba(19, 22, 54, 0.16)',
        'ai': '0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 16px rgba(59, 130, 246, 0.08)',
      },
      maxWidth: {
        'content-sm': '640px',
        'content-md': '768px',
        'content-lg': '960px',
        'content-xl': '1200px',
      },
      transitionDuration: {
        'instant': '100ms',
        'fast':    '200ms',
        'normal':  '300ms',
        'slow':    '500ms',
        'glacial': '800ms',
      },
    },
  },
  plugins: [],
}
