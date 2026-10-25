// Purple gradient color theme for Weathering Waves
export const theme = {
    colors: {
        // Primary gradients
        primary: {
            start: '#667eea',
            end: '#764ba2',
        },
        // Secondary accent gradients
        secondary: {
            start: '#f093fb',
            end: '#f5576c',
        },
        // Dark mode background gradients
        background: {
            start: '#1a1a2e',
            middle: '#16213e',
            end: '#0f0f23',
        },
        // Card backgrounds (glassmorphism)
        card: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'rgba(255, 255, 255, 0.2)',
        },
        // Text colors
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            muted: 'rgba(255, 255, 255, 0.5)',
        },
        // Status colors
        success: '#4ade80',
        error: '#f87171',
        warning: '#fbbf24',
        // Weather condition colors
        weather: {
            sunny: '#fbbf24',
            cloudy: '#94a3b8',
            rainy: '#60a5fa',
            stormy: '#8b5cf6',
            snowy: '#e2e8f0',
        },
    },

    // Typography
    typography: {
        fontSizes: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 18,
            xl: 24,
            xxl: 32,
            xxxl: 48,
            huge: 72,
        },
        fontWeights: {
            light: '300',
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
    },

    // Spacing
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    // Border radius
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },

    // Shadows
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
        glow: {
            shadowColor: '#667eea',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
        },
    },
};

export default theme;
