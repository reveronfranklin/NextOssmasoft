/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid',
  'mathjs',
  'complex.js',
  'fraction.js',
  'decimal.js',
  'typed-function',
  '@xenova/transformers',
  '@mlc-ai/web-llm'
])

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  useFileSystemPublicRoutes: false,
  outputFileTracing: false,
  images: {
    unoptimized: true,
  },



  typescript: {
    ignoreBuildErrors: true,
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
      src: path.resolve(__dirname, './src')
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    }

    return config
  }
}

module.exports = withTM(nextConfig)