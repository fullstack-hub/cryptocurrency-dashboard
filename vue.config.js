module.exports = {
    transpileDependencies: ['vuetify'],
    devServer: {
        port: process.env.VUE_APP_PORT || 9090,
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = 'Crypto Dashboard 1.0'
            return args
        })
    },
}
