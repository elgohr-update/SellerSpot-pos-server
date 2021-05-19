import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, DefinePlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import { getEnvironmentVariables } from './src/config/dotenv';

const webpackConfiguration = (env: {
    production?: boolean;
    development?: boolean;
}): Configuration => {
    const isProduction = env.production ? true : false;
    const envVariables = getEnvironmentVariables(isProduction);
    return {
        entry: './src',
        externals: [nodeExternals()],
        resolve: {
            extensions: ['.ts', '.js'],
            plugins: [new TsconfigPathsPlugin()],
        },
        output: {
            path: path.join(__dirname, '/dist'),
            filename: 'index.js',
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: isProduction,
                    },
                    exclude: [/dist/, /node_modules/],
                },
            ],
        },
        plugins: [
            new DefinePlugin(envVariables), // setting environment variables
            new CleanWebpackPlugin(),
            new ForkTsCheckerWebpackPlugin({
                eslint: {
                    files: './src',
                },
            }),
            !isProduction
                ? new WebpackShellPluginNext({
                      onBuildEnd: {
                          scripts: ['npm run dev:server'],
                          blocking: false,
                          parallel: true,
                      },
                      safe: true,
                  })
                : new DefinePlugin({}),
        ],
        watch: !isProduction,
    };
};

export default webpackConfiguration;
