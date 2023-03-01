module.exports = {
    stories: ['../src/components/**/*.stories.tsx'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-webpack5',
    },
    webpackFinal: async (baseConfig) => {
        baseConfig.module.rules.push({
            test: /\.s[ac]ss$/,
            use: [
                'style-loader',
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
        })
        return { ...baseConfig }
    },
}
