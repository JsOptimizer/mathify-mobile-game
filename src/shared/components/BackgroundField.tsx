import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export interface BackgroundFieldProps {
  children?: React.ReactNode;
}

export function BackgroundField({ children }: BackgroundFieldProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B1126' }}>
      <LinearGradient
        colors={['#0B1126', '#060A1A', '#0B1126']}
        locations={[0, 0.55, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

export default BackgroundField;
