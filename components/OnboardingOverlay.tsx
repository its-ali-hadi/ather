import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
  useColorScheme,
  Animated as RNAnimated,
} from 'react-native';
import Svg, { Defs, Rect, Mask, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetPosition?: { x: number; y: number; width: number; height: number };
  padding?: number; // Padding around the highlighted element
  shape?: 'circle' | 'rect'; // Shape of the highlight
}

interface OnboardingOverlayProps {
  visible: boolean;
  steps: OnboardingStep[];
  currentStepIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

export default function OnboardingOverlay({
  visible,
  steps,
  currentStepIndex,
  onNext,
  onPrevious,
  onSkip,
  onFinish,
}: OnboardingOverlayProps) {
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const scaleAnim = useRef(new RNAnimated.Value(0.9)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#FFFFFF',
    border: colorScheme === 'dark' ? 'rgba(196, 165, 123, 0.4)' : 'rgba(184, 149, 106, 0.5)',
  };

  useEffect(() => {
    if (visible) {
      RNAnimated.parallel([
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation for highlight
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: false,
          }),
          RNAnimated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      pulseAnim.setValue(1);
    }
  }, [visible, currentStepIndex, fadeAnim, scaleAnim, pulseAnim]);

  if (!visible || !steps[currentStepIndex]) return null;

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLastStep) {
      onFinish();
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPrevious();
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSkip();
  };

  // Calculate spotlight position for rectangular or circular highlight
  const getSpotlightRect = () => {
    if (!currentStep.targetPosition) {
      // Default position for navigation bar (bottom)
      const padding = currentStep.padding || 10;
      return {
        x: padding,
        y: height - 100 - padding,
        width: width - padding * 2,
        height: 80,
        rx: 20,
        shape: 'rect' as const,
      };
    }

    const { x, y, width: w, height: h } = currentStep.targetPosition;
    const padding = currentStep.padding || 10;
    const shape = currentStep.shape || 'rect';
    
    if (shape === 'circle') {
      // For circle, calculate center and radius
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const radius = Math.max(w, h) / 2 + padding;
      
      return {
        x: centerX - radius,
        y: centerY - radius,
        width: radius * 2,
        height: radius * 2,
        rx: radius,
        cx: centerX,
        cy: centerY,
        r: radius,
        shape: 'circle' as const,
      };
    }
    
    return {
      x: x - padding,
      y: y - padding,
      width: w + padding * 2,
      height: h + padding * 2,
      rx: 15, // Border radius
      shape: 'rect' as const,
    };
  };

  const spotlight = getSpotlightRect();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* SVG Overlay with Rectangular or Circular Spotlight */}
        <RNAnimated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Svg width={width} height={height}>
            <Defs>
              <Mask id="mask">
                <Rect x="0" y="0" width={width} height={height} fill="white" />
                {spotlight.shape === 'circle' ? (
                  <Circle
                    cx={spotlight.cx}
                    cy={spotlight.cy}
                    r={spotlight.r}
                    fill="black"
                  />
                ) : (
                  <Rect
                    x={spotlight.x}
                    y={spotlight.y}
                    width={spotlight.width}
                    height={spotlight.height}
                    rx={spotlight.rx}
                    ry={spotlight.rx}
                    fill="black"
                  />
                )}
              </Mask>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={width}
              height={height}
              fill="rgba(0, 0, 0, 0.85)"
              mask="url(#mask)"
            />
          </Svg>
        </RNAnimated.View>

        {/* Highlight Border */}
        {currentStep.targetPosition && (
          <RNAnimated.View
            style={[
              styles.highlightBorder,
              {
                left: spotlight.x,
                top: spotlight.y,
                width: spotlight.width,
                height: spotlight.height,
                borderRadius: spotlight.rx,
                opacity: fadeAnim,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}

        {/* Tooltip */}
        <RNAnimated.View
          style={[
            styles.tooltipContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.tooltip, { borderColor: COLORS.border }]}>
            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              <View style={[styles.stepNumber, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.stepNumberText}>{currentStepIndex + 1}</Text>
              </View>
              <Text style={[styles.stepTotal, { color: COLORS.text }]}>
                من {steps.length}
              </Text>
            </View>

            {/* Content */}
            <Text style={[styles.title, { color: COLORS.text }]}>
              {currentStep.title}
            </Text>
            <Text style={[styles.description, { color: COLORS.text }]}>
              {currentStep.description}
            </Text>

            {/* Progress Dots */}
            <View style={styles.dotsContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentStepIndex
                          ? COLORS.accent
                          : 'rgba(255, 255, 255, 0.3)',
                      width: index === currentStepIndex ? 24 : 8,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              {!isFirstStep && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={[styles.button, styles.secondaryButton, { borderColor: COLORS.primary }]}
                >
                  <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                  <Text style={[styles.buttonText, { color: COLORS.primary }]}>
                    السابق
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={handleSkip} style={[styles.button, styles.skipButton]}>
                <Text style={[styles.skipText, { color: COLORS.text, opacity: 0.7 }]}>
                  تخطي
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleNext} style={[styles.button, styles.primaryButton]}>
                <LinearGradient
                  colors={['#C9A876', '#B8956A']}
                  style={styles.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLastStep ? 'إنهاء' : 'التالي'}
                  </Text>
                  <Ionicons
                    name={isLastStep ? 'checkmark' : 'arrow-back'}
                    size={16}
                    color="#FFF"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </RNAnimated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  highlightBorder: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#E8B86D',
    backgroundColor: 'transparent',
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
  },
  tooltip: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 20,
    backgroundColor: 'rgba(42, 36, 32, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  stepIndicator: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  stepTotal: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 12,
    fontFamily: 'Cairo_700Bold',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  secondaryButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Cairo_600SemiBold',
  },
  skipButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
  },
  primaryButton: {
    overflow: 'hidden',
  },
  primaryGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});
