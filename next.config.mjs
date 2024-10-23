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
            source: '/:projectSlug/:slug',  // This is the path on the subdomain
            has: [
              {
                type: 'host',
                value: ':username.boxmarkdown.com',  // This matches the 'main' subdomain
              },
            ],
            destination: 'https://boxmarkdown.com/:username/:projectSlug/:slug',  // Redirect to the main site
          },
        ];
      },

  
    
};

export default nextConfig;
