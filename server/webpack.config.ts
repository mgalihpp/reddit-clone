import { Configuration } from 'webpack'
import path from 'path'
import nodeExternals from 'webpack-node-externals'
import WebpackShellPluginNext from 'webpack-shell-plugin-next'

const getConfig = (env: { [key: string]: string }, argv: { [key: string]: string }): Configuration => {
  require('dotenv').config({
    path: path.resolve(__dirname, `.env.${env.mode}`)
  })
  return {
    entry: './src/server.ts',
    target: 'node',
    mode: argv.mode === 'production' ? 'production' : 'development',
    externals: [nodeExternals()],
    plugins: [
      new WebpackShellPluginNext({
        onBuildStart: {
          scripts: ['pnpm run clean:dev && pnpm run clean:prod'],
          blocking: true,
          parallel: false
        },
        onBuildEnd: {
          scripts: ['pnpm run dev'],
          blocking: false,
          parallel: true
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          loader: 'ts-loader',
          options: {},
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@configs': path.resolve(__dirname, 'src/configs/'),
        '@controllers': path.resolve(__dirname, 'src/controllers/'),
        '@helpers': path.resolve(__dirname, 'src/helpers/'),
        '@interfaces': path.resolve(__dirname, 'src/interfaces/'),
        '@libs': path.resolve(__dirname, 'src/libs/'),
        '@middlewares': path.resolve(__dirname, 'src/middlewares/'),
        '@validators': path.resolve(__dirname, 'src/validators/'),
        '@models': path.resolve(__dirname, 'src/models/'),
        '@routes': path.resolve(__dirname, 'src/routes/'),
        '@services': path.resolve(__dirname, 'src/services/')
      }
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'index.js'
    },
    optimization: {
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all'
      }
    }
  }
}
export default getConfig
