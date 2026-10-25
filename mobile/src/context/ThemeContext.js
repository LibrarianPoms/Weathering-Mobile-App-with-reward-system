import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { theme as defaultTheme } from '../styles/theme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const { user } = useAuth();
    const [activeTheme, setActiveTheme] = useState(defaultTheme.colors.background);
    const [activeFont, setActiveFont] = useState('System');

    // Theme Definitions matching backend IDs
    const THEMES = {
        'theme_default': defaultTheme.colors.background,
        'theme_ocean': { start: '#2E3192', end: '#1BFFFF' }, // Blue
        'theme_sunset': { start: '#FF512F', end: '#DD2476' }, // Orange
        'theme_forest': { start: '#11998e', end: '#38ef7d' }, // Green
        'theme_midnight': { start: '#000000', end: '#434343' }, // Black
    };

    // Font Definitions matching backend IDs
    const FONTS = {
        'font_default': 'System',
        'font_serif': 'serif',
        'font_mono': 'monospace',
    };

    useEffect(() => {
        if (user) {
            if (user.equipped_theme && THEMES[user.equipped_theme]) {
                setActiveTheme(THEMES[user.equipped_theme]);
            } else {
                setActiveTheme(THEMES['theme_default']);
            }

            if (user.equipped_font && FONTS[user.equipped_font]) {
                setActiveFont(FONTS[user.equipped_font]);
            } else {
                setActiveFont(FONTS['font_default']);
            }
        }
    }, [user]);

    const value = {
        activeTheme,
        activeFont,
        THEMES,
        FONTS
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
