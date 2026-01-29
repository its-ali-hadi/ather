import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useCopilot } from 'react-native-copilot';

export default function CustomTooltip() {
  const {
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrev,
    stop,
    currentStep,
  } = useCopilot();

  const colorScheme = useColorScheme();

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#FFFFFF',
    border: colorScheme === 'dark' ? 'rgba(196, 165, 123, 0.4)' : 'rgba(184, 149, 106, 0.5)',
  };

  return (
    <View style={styles.tooltipWrapper}>
      <View style={[styles.tooltipContainer, { borderColor: COLORS.border }]}>
        {/* Content */}
        <Text style={[styles.tooltipText, { color: COLORS.text }]}>
          {currentStep?.text}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          {!isFirstStep && (
            <TouchableOpacity
              onPress={goToPrev}
              style={[styles.button, styles.secondaryButton, { borderColor: COLORS.primary }]}
            >
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
              <Text style={[styles.buttonText, { color: COLORS.primary }]}>
                السابق
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={stop}
            style={[styles.button, styles.skipButton]}
          >
            <Text style={[styles.skipText, { color: COLORS.text, opacity: 0.7 }]}>
              تخطي
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNext}
            style={[styles.button, styles.primaryButton]}
          >
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
    </View>
  );
}

const styles = StyleSheet.create({
  tooltipWrapper: {
    margin: 16,
  },
  tooltipContainer: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    backgroundColor: 'transparent',
  },
  tooltipText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
    marginBottom: 16,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    paddingVertical: 8,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});
