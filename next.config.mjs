/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Preview is served over the machine's LAN IP rather than localhost, so
  // Next.js's dev-only cross-origin guard blocks JS chunk/HMR requests
  // unless that origin is explicitly allowed — without this the page
  // renders as static HTML with no interactivity.
  allowedDevOrigins: ['192.168.72.80'],
}

export default nextConfig
