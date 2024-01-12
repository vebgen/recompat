/* eslint-disable */
export default {
    displayName: 'access-api',
    preset: '../../jest.preset.js',
    transform: {
        '^(?!.*\\.(js|ts|css|json)$)': '@nx/react/plugins/jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    coverageDirectory: '../../coverage/packages/access-api',
};
