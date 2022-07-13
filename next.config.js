/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  serverRuntimeConfig: {
    JWT_SECRET: "SOME_SECRET_STRING",
  },

  env: {
    BASE_URL: "http://localhost:3000",
  },
  nextConfig,
};
