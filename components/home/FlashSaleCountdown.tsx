// components/home/FlashSaleCountdown.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface FlashSaleCountdownProps {
  endTime: number;
  onPress: () => void;
}

const FlashSaleCountdown = ({ endTime, onPress }: FlashSaleCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [pulseAnim] = useState(new Animated.Value(1));

  function calculateTimeLeft() {
    const difference = endTime - Date.now();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, [endTime]);

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  const { hours = 0, minutes = 0, seconds = 0 } = timeLeft as any;

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#FF3B30', '#FF5E51']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.container}
        >
          <View style={styles.content}>
            <View style={styles.leftSection}>
              <View style={styles.iconContainer}>
                <Feather name="zap" size={16} color="#fff" />
              </View>
              <View>
                <Text style={styles.title}>Flash Sale</Text>
                <Text style={styles.subtitle}>Limited time offers</Text>
              </View>
            </View>

            <View style={styles.timerContainer}>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{formatTime(hours)}</Text>
                <Text style={styles.timeLabel}>HRS</Text>
              </View>
              <Text style={styles.colon}>:</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{formatTime(minutes)}</Text>
                <Text style={styles.timeLabel}>MIN</Text>
              </View>
              <Text style={styles.colon}>:</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{formatTime(seconds)}</Text>
                <Text style={styles.timeLabel}>SEC</Text>
              </View>
            </View>

            <View style={styles.arrowContainer}>
              <Feather name="arrow-right" size={20} color="#fff" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  timeBox: {
    alignItems: 'center',
    minWidth: 36,
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  timeLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    marginTop: 2,
  },
  colon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FlashSaleCountdown;