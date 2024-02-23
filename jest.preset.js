const nxPreset = require('@nx/jest/preset').default;
const path = require('path');

module.exports = {
    ...nxPreset,
    setupFiles: [
        ...(nxPreset.setupFiles || []),

        // Execute the global setup for all packages in the monorepo.
        path.join(__dirname, 'jest-setup.js'),

        // Execute the setup for the current package.
        // '<rootDir>/jest-setup.js'
    ],
};
