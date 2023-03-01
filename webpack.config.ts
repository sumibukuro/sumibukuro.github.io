import fs from 'fs'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import FaviconsWebpackPlugin from 'favicons-webpack-plugin'
// import BundleAnalyzerPlugin from 'webpack-bundle-analyzer'
import WorkboxWebpackPlugin from 'workbox-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const InjectBodyWebpackPlugin = require('inject-body-webpack-plugin').default
const buildConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'build.json'), 'utf-8'))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config = (env: any, argv: { mode: string }) => {
    const devMode = argv.mode === 'development'

    // Plugin
    const plugins = [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name]-[fullhash].css',
        }),
        new InjectBodyWebpackPlugin({ content: '<style>html,body,#root{margin:0;padding:0;}</style><div id="root"></div>', position: 'start' }),
        new CopyPlugin({
            patterns: [{ from: 'src/static', to: './' }],
        }),
        new FaviconsWebpackPlugin({
            logo: './src/static/assets/icon.svg',
            logoMaskable: './src/static/assets/icon.svg',
            favicons: {
                appName: buildConfig.meta.title,
                appShortName: buildConfig.meta.title,
                appDescription: buildConfig.meta.description,
                start_url: '/',
                background: buildConfig.meta.color,
                theme_color: buildConfig.meta.color,
                icons: {
                    favicons: true,
                    windows: true,
                    android: true,
                    appleIcon: [
                        // 'apple-touch-icon-1024x1024.png',
                        'apple-touch-icon-114x114.png',
                        'apple-touch-icon-120x120.png',
                        'apple-touch-icon-144x144.png',
                        'apple-touch-icon-152x152.png',
                        'apple-touch-icon-167x167.png',
                        'apple-touch-icon-180x180.png',
                        'apple-touch-icon-57x57.png',
                        'apple-touch-icon-60x60.png',
                        'apple-touch-icon-72x72.png',
                        'apple-touch-icon-76x76.png',
                        'apple-touch-icon-precomposed.png',
                        'apple-touch-icon.png',
                    ],
                    appleStartup: false,
                    yandex: false,
                },
            },
        }),
        // new BundleAnalyzerPlugin()
    ]
    if (!devMode) {
        plugins.push(
            new WorkboxWebpackPlugin.GenerateSW({
                exclude: [/\.DS_Store/],
                swDest: 'assets/sw.js',
            }),
        )
    }
    const meta = {
        description: buildConfig.meta.description,
        'og:description': {
            property: 'og:description',
            content: buildConfig.meta.description,
        },
        'og:title': {
            property: 'og:title',
            content: buildConfig.meta.title,
        },
        'og:type': {
            property: 'og:type',
            content: 'website',
        },
        'twitter:card': {
            property: 'twitter:card',
            content: 'summary_large_image',
        },
    }
    if (process.env.NODE_ENV !== 'app') {
        meta['og:image'] = {
            property: 'og:image',
            content: `https://${buildConfig.meta.host}/assets/ogp.jpg`,
        }
    }
    plugins.unshift(
        new HtmlWebpackPlugin({
            title: buildConfig.meta.title,
            filename: 'index.html',
            meta,
        }),
    )

    // Config
    return {
        entry: path.join(__dirname, './src/index.tsx'),
        devServer: {
            static: {
                directory: path.join(__dirname, './src/static'),
            },
            historyApiFallback: true,
            devMiddleware: {
                writeToDisk: true,
            },
        },
        module: {
            rules: [
                {
                    test: /\.(wav|mp3|png|glb)$/i,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[name]-[hash].[ext]',
                        },
                    },
                },
                {
                    test: /\.(md|txt|json|xml)$/i,
                    use: 'raw-loader',
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
                {
                    test: /\.tsx?$/i,
                    use: 'ts-loader',
                    exclude: /(node_modules|\.test\.tsx?$)/,
                },
                {
                    test: /\.s?[ac]ss$/i,
                    use: [
                        'style-loader',
                        // MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[local]_[hash:base64:5]',
                                },
                            },
                        },
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins,
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    three: {
                        test: /(react-)?three/,
                        name: 'assets/three',
                        chunks: 'initial',
                        enforce: true,
                    },
                    react: {
                        test: /react(-\w)*|i18next/,
                        name: 'assets/react',
                        chunks: 'initial',
                        enforce: true,
                    },
                    tone: {
                        test: /tone/,
                        name: 'assets/tone',
                        chunks: 'initial',
                        enforce: true,
                    },
                    modules: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'assets/modules',
                        chunks: 'initial',
                        enforce: true,
                    },
                    app: {
                        test: /[\\/]src[\\/]/,
                        name: 'assets/app',
                        chunks: 'initial',
                        enforce: true,
                    },
                },
            },
        },
        output: {
            path: path.resolve(__dirname, 'www'),
            filename: '[name]-[fullhash].js',
            publicPath: process.env.NODE_ENV === 'app' ? './' : '/',
            clean: true,
        },
    }
}

export default config
