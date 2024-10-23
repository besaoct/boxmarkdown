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
                        value: 'boxmarkdown.com',  // This matches the root domain
                    },
                ],
                destination: 'https://boxmarkdown.com/:username/:projectSlug/:slug',  // Redirect to the main site
            },
            {
                source: '/:projectSlug/:slug',  // This is the path for dynamic subdomains
                destination: 'https://boxmarkdown.com/:username/:projectSlug/:slug',  // Redirect to the main site
                has: [
                    {
                        type: 'host',
                        value: '(.*).boxmarkdown.com',  // Regular expression for dynamic subdomains
                    },
                ],
            },
        ];
    },

  
    
};

export default nextConfig;
