// jest setup - extend expectations and testing library if installed
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('@testing-library/jest-dom/extend-expect');
} catch (err) {
	// optional - testing library not installed in minimal env
}

// Polyfill fetch for Firebase SDK in Jest (node environment)
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const crossFetch = require('cross-fetch');
	// @ts-ignore
	if (!global.fetch) global.fetch = crossFetch.fetch || crossFetch;
} catch (err) {
	// ignore if polyfill not available
}
