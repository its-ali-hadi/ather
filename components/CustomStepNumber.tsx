import { View, StyleSheet } from 'react-native';

export default function CustomStepNumber() {
  // Return an empty view to hide the step number
  return <View style={styles.hidden} />;
}

const styles = StyleSheet.create({
  hidden: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});