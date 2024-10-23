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
                value: ':username.boxmarkdown.com'
              }
            ],
            destination: 'https://boxmarkdown.com/:username/:projectSlug/:slug',
          },
        ];
      }
      
};

export default nextConfig;
