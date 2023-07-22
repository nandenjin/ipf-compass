/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    console.log(config.externals)
    config.externals.push({ knex: 'commonjs knex' })
    return config
  },
}

module.exports = nextConfig
