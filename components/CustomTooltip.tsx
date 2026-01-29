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
    background: colorScheme === 'dark' ? 'rgba(42, 36, 32, 0.98)' : 'rgba(255, 255, 255, 0.98)',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  return (
    <View style={[styles.tooltipContainer, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#E8B86D', '#D4A574']}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="bulb" size={24} color="#FFF" />
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={[styles.stepNumber, { color: COLORS.accent }]}>
            خطوة {currentStep?.order}
          </Text>
          <Text style={[styles.stepName, { color: COLORS.textSecondary }]}>
            {currentStep?.name}
          </Text>
        </View>
      </View>

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
            <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
            <Text style={[styles.buttonText, { color: COLORS.primary }]}>
              السابق
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={stop}
          style={[styles.button, styles.skipButton]}
        >
          <Text style={[styles.skipText, { color: COLORS.textSecondary }]}>
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
              size={18} 
              color="#FFF" 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    borderRadius: 20,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  stepName: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    marginTop: 2,
  },
  tooltipText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondaryButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Cairo_600SemiBold',
  },
  skipButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
  },
  primaryButton: {
    overflow: 'hidden',
  },
  primaryGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});
