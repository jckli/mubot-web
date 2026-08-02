/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "cdn.mangabaka.dev" },
      { protocol: "https", hostname: "cdn.mangaupdates.com", pathname: "/image/**" },
    ],
  },
}
