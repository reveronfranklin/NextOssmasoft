/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
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
  'typed-function'
])

module.exports = withTM({
  trailingSlash: true,
  reactStrictMode: false,
  useFileSystemPublicRoutes: false,
  experimental: {
    esmExternals: false
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    'mathjs',
    'complex.js',
    'fraction.js',
    'decimal.js',
    'typed-function'
  ],
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    // Añade esto para mathjs
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    }

    return config
  }
})
