/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // the home page has nothing on it, so send people straight to the search page
  async redirects() {
    return [{ source: "/", destination: "/air/search", permanent: false }];
  },
};

export default nextConfig;
