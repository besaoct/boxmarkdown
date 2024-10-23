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
        source: '/:projectSlug/:slug',  // Handle subdomain routing path
        has: [
          {
            type: 'host',
            value: ':username.boxmarkdown.com',  // Match subdomain
          },
        ],
        destination: 'https://boxmarkdown.com/:username/:projectSlug/:slug',  // Route to dynamic folder structure
      },
    ];
  },
      
};

export default nextConfig;
