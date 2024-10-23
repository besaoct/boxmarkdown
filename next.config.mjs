/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/:projectSlug/:slug',  // Handle subdomain routing path
        has: [
          {
            type: 'host',
            value: ':username.boxmarkdown.com',  // Match subdomain
          },
        ],
        destination: '/:username/:projectSlug/:slug',  // Route to dynamic folder structure
      },
    ];
  },


    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '*',
            port: '',
          },
        ],
      }
      
};

export default nextConfig;
