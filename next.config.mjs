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
            source: '/legal/privacy-policy',  // This is the path on the subdomain
            has: [
              {
                type: 'host',
                value: 'main.boxmarkdown.com',  // This matches the 'main' subdomain
              },
            ],
            destination: 'https://boxmarkdown.com/main/legal/privacy-policy',  // Redirect to the main site
          },
        ];
      },
      
};

export default nextConfig;
