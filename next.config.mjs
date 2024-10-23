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
        source: '/:username/:projectSlug/:slug',  // Handle subdomain routing path
        has: [
          {
            type: 'host',
            value: 'boxmarkdown.com',  // Match subdomain
          },
        ],
        destination: 'https://:username.boxmarkdown.com/:projectSlug/:slug',  // Route to dynamic folder structure
      },
    ];
  },
      
};

export default nextConfig;
