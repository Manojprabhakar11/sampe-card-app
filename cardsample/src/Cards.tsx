import React, { useRef } from 'react';
import Card from './Card';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useSampleDataHook from '../customHooks/useSampleDataHook';

const SCROLL_THRESHOLD = 300;

const Cards = () => {
  const data = useSampleDataHook();
  const flatListRef = useRef<FlatList<any>>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fadeAnim = scrollY.interpolate({
    inputRange: [SCROLL_THRESHOLD - 50, SCROLL_THRESHOLD + 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        testID="flat-list"
        ref={flatListRef}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card title={item.title} description={item.description} />
        )}
        contentContainerStyle={styles.list}
        onScroll={e => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
        initialNumToRender={30}
        removeClippedSubviews={true}
      />

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
          <Text style={styles.scrollTopText}>↑ Top</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  list: { padding: 10 },
  scrollTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  scrollTopText: { color: '#fff', fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#007AFF' },
});

export default Cards;
