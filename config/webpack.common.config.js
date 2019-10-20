const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
   entry: './src/index.js',
   output: {
      filename: 'main.js',
      path: path.resolve(__dirname, '../public') // for zeit deployment
   },

   module: {
      rules: [
         // {
         //    test: [/.js$/],
         //    exclude: [/node_modules/, /data-input-card.js/],
         //    use: {
         //       loader: 'babel-loader',
         //       options: {
         //          presets: ['@babel/preset-env']
         //       }
         //    }
         // },
         {
            test: [/.css$|.scss$/],
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
         },
         {
            test: /\.(png | jpg | gif | svg)$ /,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     name: '[name].[ext]',
                     outputPath: 'assets/imagess'
                  }
               }
            ]
         },
         {
            test: /\.pug$/,
            use: ['pug-loader']
         }
      ]
   },

   plugins: [
      new HtmlWebpackPlugin({
         template: './src/index.pug',
         inject: true,
         minify: {
            removeComments: true,
            collapseWhitespace: false
         }
      }),
      new MiniCssExtractPlugin({
         filename: 'style.css'
      }),
      new CopyWebpackPlugin([
         {
            from: './src/assets/images',
            to: 'assets/images'
         }
      ])
   ],

   resolve: {
      extensions: ['.js', '.ts']
   }
}
