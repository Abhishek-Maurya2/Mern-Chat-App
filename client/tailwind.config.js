/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#755085",
        onPrimary: "#FFFFFF",
        primaryContainer: "#F6D9FF",
        onPrimaryContainer: "#2D0B3D",
        onSecondary: "#FFFFFF",
        onSecondaryContainer: "#231728",
        tertiary: "#815251",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#FFDAD9",
        onTertiaryContainer: "#331112",
        error: "#BA1A1A",
        onError: "#FFFFFF",
        errorContainer: "#FFDAD6",
        onErrorContainer: "#410002",
        background: "#FFF7FC",
        onBackground: "#1E1A1F",
        onSurface: "#1E1A1F",
        onSurfaceVariant: "#4C444D",
        outline: "#7D747E",
        outlineVariant: "#CEC3CE",
        inverseSurface: "#342F34",
        inverseOnSurface: "#F8EEF6",
        inversePrimary: "#E3B7F4",
        primaryFixed: "#F6D9FF",
        onPrimaryFixed: "#2D0B3D",
        primaryFixedDim: "#E3B7F4",
        onPrimaryFixedVariant: "#5C396C",
        onSecondaryFixed: "#231728",
        onSecondaryFixedVariant: "#504255",
        tertiaryFixed: "#FFDAD9",
        onTertiaryFixed: "#331112",
        tertiaryFixedDim: "#F5B7B6",
        onTertiaryFixedVariant: "#663B3B",
      },
    },
  },
  plugins: [],
};
