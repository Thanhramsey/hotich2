module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://congdichvu.gialai.gov.vn",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
      "/igate": {
        target: "https://apiigate.gialai.gov.vn",
        changeOrigin: true,
        pathRewrite: { "^/igate": "" },
      },
    },
  },
  publicPath: process.env.NODE_ENV === "production" ? "/hoTich2/" : "/",
};
