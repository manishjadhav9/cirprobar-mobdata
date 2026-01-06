import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RADIUS = 80;
const STROKE_WIDTH = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CircularProgressBarProps {
    percentage: number;
    total: number;
    used: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ percentage, total, used }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        // Animate to the new percentage smoothly
        progress.value = withTiming(percentage, { duration: 500 });
    }, [percentage]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = CIRCUMFERENCE * progress.value;

        // Color Interpolation Logic
        // 0% used (100% remaining) -> Green
        // 50% used (50% remaining) -> Green/Orange transition point?
        // Let's define it by "Remaining" which is (1 - progress)
        // > 0.5 remaining: Green
        // 0.2 - 0.5 remaining: Orange
        // < 0.2 remaining: Red

        // We can use interpolateColor for smooth transition or conditional for steps.
        // User asked for "Green -> Orange -> Red".
        // Let's do smooth interpolation for a "Dynamic" feel.

        // Logic: 
        // progress 0 (Full data left) -> Green
        // progress 0.5 (Half data left) -> Orange? Or still Green?
        // Let's map progress (0 to 1):
        // 0 - 0.5: Green to Orange ? No, usually starts Green.
        // 0.0 -> Green
        // 0.5 -> Orange
        // 0.8 -> Red (20% left)
        // 1.0 -> Red

        let stroke = '#4CAF50';
        if (progress.value > 0.8) {
            stroke = '#F44336';
        } else if (progress.value > 0.5) {
            stroke = '#FF9800';
        }

        return {
            strokeDashoffset,
            stroke: stroke, // Use discrete logic or interpolated color
        };
    });

    // Derived value for text color if we want
    // But we can just use the React prop for the text since it updates every second anyway.

    // Color helper for Text
    const getColor = (p: number) => {
        if (p > 0.8) return '#F44336';
        if (p > 0.5) return '#FF9800';
        return '#4CAF50';
    };
    const color = getColor(percentage);

    const isDataExhausted = percentage >= 1;

    return (
        <View style={styles.container}>
            <Svg width={(RADIUS + STROKE_WIDTH) * 2} height={(RADIUS + STROKE_WIDTH) * 2}>
                <G rotation="-90" origin={`${RADIUS + STROKE_WIDTH}, ${RADIUS + STROKE_WIDTH}`}>
                    {/* Background Circle */}
                    <Circle
                        cx={RADIUS + STROKE_WIDTH}
                        cy={RADIUS + STROKE_WIDTH}
                        r={RADIUS}
                        stroke="#E0E0E0"
                        strokeWidth={STROKE_WIDTH}
                        fill="transparent"
                    />
                    {/* Progress Circle - Hide if exhausted to match 'empty/grey' look or keep red? 
                        The image shows a grey ring. If we want it to disappear, we condition it.
                        But keeping it red might be better for 'Exhausted'. 
                        User said "when data is cover... show No data Available similar to image".
                        Image circle looks faint. Let's hide the progress circle if exhausted.
                    */}
                    {!isDataExhausted && (
                        <AnimatedCircle
                            cx={RADIUS + STROKE_WIDTH}
                            cy={RADIUS + STROKE_WIDTH}
                            r={RADIUS}
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeLinecap="round"
                            animatedProps={animatedProps}
                        />
                    )}
                </G>
            </Svg>
            <View style={styles.textContainer}>
                {isDataExhausted ? (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.alertTitle}>No</Text>
                        <Text style={styles.alertTitle}>Data Available</Text>
                        <View style={styles.divider} />
                        <Text style={styles.alertSubtitle}>RECHARGE</Text>
                        <Text style={styles.alertSubtitle}>NOW</Text>
                    </View>
                ) : (
                    <>
                        <Text style={[styles.percentageText, { color }]}>
                            {Math.round((1 - percentage) * 100)}%
                        </Text>
                        <Text style={styles.subText}>Remaining</Text>
                        <Text style={styles.dataText}>
                            {Math.round(used)} MB / {total} MB
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 14,
        color: '#888',
    },
    dataText: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF3B30', // Red
        textAlign: 'center',
    },
    alertSubtitle: {
        fontSize: 10,
        color: '#333',
        textAlign: 'center',
        letterSpacing: 1,
    },
    divider: {
        height: 1,
        width: 40,
        backgroundColor: '#ccc',
        marginVertical: 4,
    }
});

export default CircularProgressBar;
