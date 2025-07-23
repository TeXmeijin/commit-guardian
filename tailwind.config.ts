import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/client/**/*.{js,ts,jsx,tsx}',
    './src/client/index.html',
  ],
  theme: {
    extend: {
      colors: {
        github: {
          canvas: {
            default: '#0d1117',
            subtle: '#161b22',
          },
          border: {
            default: '#30363d',
            muted: '#21262d',
          },
          fg: {
            default: '#e6edf3',
            muted: '#8b949e',
            subtle: '#656d76',
          },
          success: {
            fg: '#3fb950',
            subtle: '#238636',
          },
          danger: {
            fg: '#f85149',
            subtle: '#da3633',
          },
          diff: {
            addition: {
              bg: '#0d4429',
              fg: '#3fb950',
            },
            deletion: {
              bg: '#67060c',
              fg: '#f85149',
            },
          },
        },
      },
      fontFamily: {
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config