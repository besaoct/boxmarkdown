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
            permanent: true, // This makes it a 301 redirect
          },
        ];
      }
      
};

export default nextConfig;
