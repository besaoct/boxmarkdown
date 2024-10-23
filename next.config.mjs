/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '*',
            port: '',
          },
        ],
      },

      async rewrites() {
        return [
          {
            source: '/:username/:projectSlug/:slug',
            has: [
              {
                type: 'host',
                value: 'boxmarkdown.com'
              }
            ],
            destination: 'https://boxmarkdown.com/:username/:projectSlug/:slug',
          },
        ];
      },

      async redirects() {
        return [
          {
            source: '/:username/:projectSlug/:slug',
            has: [
              {
                type: 'host',
                value: 'boxmarkdown.com'
              }
            ],
            destination: 'https://:username.boxmarkdown.com/:projectSlug/:slug',
            permanent: true, // 301 Permanent redirect
          },
        ];
      },
      
};

export default nextConfig;
