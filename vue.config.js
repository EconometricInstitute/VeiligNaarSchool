const path = require("path");
const WorkerPlugin = require('worker-plugin');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    output: {
      globalObject: "this",
    },
    plugins: [
      new WorkerPlugin()
    ],  
  },
  outputDir: path.resolve(__dirname, "docs"),
  publicPath: process.env.NODE_ENV === 'production' ? '/VeiligNaarSchool/' : '/',
  pages: {
    index: {
      entry: './src/main.js',
      title: 'Veilig Naar School'
    }
  }  
}
