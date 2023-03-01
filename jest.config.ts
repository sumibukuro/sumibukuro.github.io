export default {
    roots: ['<rootDir>/src'],
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.(j|t)sx?$': 'ts-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!three/examples/)'],
    moduleNameMapper: {
        '\\.(css|scss|sass)$': 'identity-obj-proxy',
    },
    testRegex: '\\.test\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
}
