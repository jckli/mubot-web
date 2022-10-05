module.exports = {
    purge: ["./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: true, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                kgcs: ["kgcs"],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
