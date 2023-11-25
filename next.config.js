/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      },
      {
        protocol: 'https',
        hostname: 'assets.lenscrafters.com',
        pathname: '/is/image/**'
      },
      {
        protocol: 'https',
        hostname: 'commerce-preview.sbx0133.play.hclsofy.com',
        pathname: '/hclstore/EmeraldCAS/images/**'
      }
    ]
  }
};
