
module.exports = {
    plugins: [
        'sonarjs',
    ],
    extends: [
        'google',
        'plugin:sonarjs/recommended',
    ],
    parserOptions: {
        ecmaVersion: 10,
    },
    env: {
        node: true,
        es6: true,
    },
    rules: {
        'indent': [
            'error',
            4,
        ],
        'max-len': ['error', 100, {
            ignoreTemplateLiterals: true,
        }],
        'linebreak-style': 'off',
        'brace-style': [
            'error',
            'stroustrup',
        ],
        'operator-linebreak': ['error', 'before'],
        'require-jsdoc': ['error', {
            require: {
                ClassDeclaration: false,
            },
        }],
    },
    overrides: [],
};