import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../styles/theme';
import { getWeatherEmoji, formatTemperature } from '../services/weatherService';

/**
 * Weather Card Component
 * Beautiful glassmorphism card displaying weather information
 */
const WeatherCard = ({ weather, isMain = false }) => {
    if (!weather) return null;

    return (
        <LinearGradient
            colors={[
                'rgba(102, 126, 234, 0.3)',
                'rgba(118, 75, 162, 0.3)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, isMain && styles.mainCard]}
        >
            <View style={styles.glassOverlay}>
                {/* Location */}
                <View style={styles.locationContainer}>
                    <Text style={styles.cityText}>{weather.city}</Text>
                    <Text style={styles.countryText}>{weather.country}</Text>
                </View>

                {/* Temperature */}
                <View style={styles.tempContainer}>
                    <Text style={styles.tempText}>
                        {formatTemperature(weather.temperature.current)}
                    </Text>
                    <Text style={styles.weatherEmoji}>
                        {getWeatherEmoji(weather.weather.icon)}
                    </Text>
                </View>

                {/* Weather Description */}
                <Text style={styles.descriptionText}>
                    {weather.weather.description}
                </Text>

                {/* High / Low */}
                <View style={styles.highLowContainer}>
                    <Text style={styles.highLowText}>
                        H: {formatTemperature(weather.temperature.max)}
                    </Text>
                    <Text style={styles.separator}>•</Text>
                    <Text style={styles.highLowText}>
                        L: {formatTemperature(weather.temperature.min)}
                    </Text>
                </View>

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Feels Like</Text>
                        <Text style={styles.detailValue}>
                            {formatTemperature(weather.temperature.feels_like)}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Humidity</Text>
                        <Text style={styles.detailValue}>
                            {weather.details.humidity}%
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Wind</Text>
                        <Text style={styles.detailValue}>
                            {weather.details.wind_speed} m/s
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Visibility</Text>
                        <Text style={styles.detailValue}>
                            {weather.details.visibility} km
                        </Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.xl,
        marginHorizontal: theme.spacing.md,
        marginVertical: theme.spacing.sm,
        overflow: 'hidden',
    },
    mainCard: {
        marginTop: theme.spacing.lg,
    },
    glassOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: theme.colors.card.border,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
    },
    locationContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    cityText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.xxl,
        fontWeight: theme.typography.fontWeights.bold,
    },
    countryText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.md,
    },
    tempContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: theme.spacing.md,
    },
    tempText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.huge,
        fontWeight: theme.typography.fontWeights.light,
    },
    weatherEmoji: {
        fontSize: 60,
        marginLeft: theme.spacing.md,
    },
    descriptionText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.lg,
        textAlign: 'center',
        textTransform: 'capitalize',
        marginBottom: theme.spacing.sm,
    },
    highLowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    highLowText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.md,
        fontWeight: theme.typography.fontWeights.medium,
    },
    separator: {
        color: theme.colors.text.muted,
        marginHorizontal: theme.spacing.sm,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    detailItem: {
        width: '48%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        alignItems: 'center',
    },
    detailLabel: {
        color: theme.colors.text.muted,
        fontSize: theme.typography.fontSizes.sm,
        marginBottom: theme.spacing.xs,
    },
    detailValue: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.lg,
        fontWeight: theme.typography.fontWeights.semibold,
    },
});

export default WeatherCard;
