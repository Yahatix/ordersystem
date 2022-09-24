const config = {
	content: ['./src/**/*.{html,svelte}'],

	theme: {
		extend: {}
	},
	daisyui: {
		themes: ['dracula', 'light'],
		darkTheme: 'dracula'
	},
	plugins: [require('daisyui')]
};

module.exports = config;
