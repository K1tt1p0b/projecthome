/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    quietDeps: true, // This will silence deprecation warnings
    silenceDeprecations: [
      "mixed-decls",
      "legacy-js-api",
      "import",
      "slash-div",
      "global-builtin",
    ],
  },

  images: {
    domains: [
      "i.ytimg.com", 
      "img.youtube.com", 
      "www.youtube.com",

      "p16-sign-sg.tiktokcdn.com",
      "p16-sign-va.tiktokcdn.com",
      "p16-sign.tiktokcdn.com",
      "p16.tiktokcdn.com",
      "p19-sign.tiktokcdn.com",
      "p77-sign.tiktokcdn.com",
    ],
      
  },
};

module.exports = nextConfig;
