const config = {
	content: ['./src/**/*.{html,svelte}'],

	theme: {
		extend: {}
	},
	daisyui: {
		themes: ['dracula'],
		darkTheme: 'dracula',
		theme: 'dracula'
	},
	plugins: [require('daisyui')]
};

module.exports = config;
