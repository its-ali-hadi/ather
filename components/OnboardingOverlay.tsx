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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetPosition?: { x: number; y: number; width: number; height: number };
  highlightRadius?: number;
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
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible, currentStepIndex]);

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <RNAnimated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        </RNAnimated.View>

        {/* Highlight Circle */}
        {currentStep.targetPosition && (
          <RNAnimated.View
            style={[
              styles.highlight,
              {
                left: currentStep.targetPosition.x + currentStep.targetPosition.width / 2 - (currentStep.highlightRadius || 50),
                top: currentStep.targetPosition.y + currentStep.targetPosition.height / 2 - (currentStep.highlightRadius || 50),
                width: (currentStep.highlightRadius || 50) * 2,
                height: (currentStep.highlightRadius || 50) * 2,
                borderRadius: currentStep.highlightRadius || 50,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(232, 184, 109, 0.2)',
    borderWidth: 3,
    borderColor: '#E8B86D',
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