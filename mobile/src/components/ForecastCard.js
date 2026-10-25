import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../styles/theme';
import { getWeatherEmoji, formatTemperature, getDayName } from '../services/weatherService';

/**
 * Forecast Card Component
 * Displays 5-day weather forecast in a horizontal scrollable list
 */
const ForecastCard = ({ forecast }) => {
    if (!forecast || !forecast.forecast) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>5-Day Forecast</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {forecast.forecast.map((day, index) => (
                    <LinearGradient
                        key={index}
                        colors={[
                            'rgba(102, 126, 234, 0.2)',
                            'rgba(118, 75, 162, 0.2)',
                        ]}
                        style={styles.dayCard}
                    >
                        <Text style={styles.dayName}>{getDayName(day.date)}</Text>
                        <Text style={styles.emoji}>
                            {getWeatherEmoji(day.weather.icon)}
                        </Text>
                        <Text style={styles.tempHigh}>
                            {formatTemperature(day.temperature.max)}
                        </Text>
                        <Text style={styles.tempLow}>
                            {formatTemperature(day.temperature.min)}
                        </Text>
                        <Text style={styles.weatherDesc}>
                            {day.weather.main}
                        </Text>
                    </LinearGradient>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
    },
    title: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.bold,
        marginBottom: theme.spacing.md,
    },
    scrollContent: {
        paddingRight: theme.spacing.md,
    },
    dayCard: {
        width: 100,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginRight: theme.spacing.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.card.border,
    },
    dayName: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.md,
        fontWeight: theme.typography.fontWeights.semibold,
        marginBottom: theme.spacing.sm,
    },
    emoji: {
        fontSize: 36,
        marginBottom: theme.spacing.sm,
    },
    tempHigh: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.lg,
        fontWeight: theme.typography.fontWeights.bold,
    },
    tempLow: {
        color: theme.colors.text.muted,
        fontSize: theme.typography.fontSizes.md,
        marginBottom: theme.spacing.xs,
    },
    weatherDesc: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.sm,
    },
});

export default ForecastCard;
