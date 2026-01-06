import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import CircularProgressBar from '../../components/CircularProgressBar';
import RechargeSuccessModal from '../../components/RechargeSuccessModal';
import { useDataSimulator } from '../../hooks/useDataSimulator';

export default function HomeScreen() {
  const { totalData, usedData, percentage, recharge, userName, planName } = useDataSimulator();
  const [modalVisible, setModalVisible] = useState(false);

  const handleRecharge = () => {
    recharge();
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <RechargeSuccessModal
        visible={modalVisible}
        onNext={() => setModalVisible(false)}
      />

      <Text style={styles.title}>Hello, {userName}</Text>
      <Text style={styles.subtitle}>{planName}</Text>

      <View style={styles.chartContainer}>
        <CircularProgressBar
          percentage={percentage}
          total={totalData}
          used={usedData}
        />
      </View>

      <View style={styles.controls}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Recharge Data"
            onPress={handleRecharge}
            color="#4CAF50"
          />
        </View>
        <Text style={styles.hint}>
          Data consumes automatically every second.
          Tap Recharge to reset.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30, // Adjust spacing
  },
  chartContainer: {
    marginBottom: 50,
    // Add shadow/elevation for "Premium" feel
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 150,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  controls: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '80%',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  hint: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  }
});
