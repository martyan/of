const autoprefixer = require('autoprefixer')

module.exports = {
    plugins: [
        autoprefixer({
            "overrideBrowserslist": [
                "last 4 versions",
                "> 1%",
                "maintained node versions",
                "not dead"
            ]
        })
    ]
}
