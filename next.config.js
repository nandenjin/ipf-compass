/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack(config) {
    config.externals.push({ knex: 'commonjs knex' })
    return config
  },
}

module.exports = nextConfig
