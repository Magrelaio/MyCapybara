import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, PanResponder } from 'react-native';
import { CapybaraStats } from './src/store/CapybaraStats.js';
import { OBJECTS } from './store/objects';

export default function RoomScreen() {
  const inventory = CapybaraStats((s) => s.inventory);
  const placedObjects = CapybaraStats((s) => s.placedObjects);
  const placeObject = CapybaraStats((s) => s.placeObject);
  const updatePlacedObject = CapybaraStats((s) => s.updatePlacedObject);

  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const resizingId = useRef(null);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  function handlePlace(obj) {
    const type = obj.type;
    const position = { x: 50, y: 10 };
    const size = { width: 60, height: 60 };
    placeObject(obj.id, type, position, size);
  }

  function getPanResponder(o) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gesture) => {
        setDraggingId(o.id);
        setDragOffset({
          x: gesture.x0 - o.position.x,
          y: gesture.y0 - o.position.y,
        });
      },
      onPanResponderMove: (_, gesture) => {
        if (draggingId === o.id) {
          updatePlacedObject(o.id, {
            position: {
              x: gesture.moveX - dragOffset.x,
              y: gesture.moveY - dragOffset.y,
            }
          });
        }
      },
      onPanResponderRelease: () => {
        setDraggingId(null);
      },
    });
  }

  function getResizeResponder(o) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gesture) => {
        resizingId.current = o.id;
        resizeStart.current = {
          x: gesture.x0,
          y: gesture.y0,
          width: o.size.width,
          height: o.size.height,
        };
      },
      onPanResponderMove: (_, gesture) => {
        if (resizingId.current === o.id) {
          const dx = gesture.moveX - resizeStart.current.x;
          const dy = gesture.moveY - resizeStart.current.y;
          updatePlacedObject(o.id, {
            size: {
              width: Math.max(40, resizeStart.current.width + dx),
              height: Math.max(40, resizeStart.current.height + dy),
            }
          });
        }
      },
      onPanResponderRelease: () => {
        resizingId.current = null;
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quarto da Capivara</Text>
      <View style={styles.room}>
        <View style={styles.wall}>
          {placedObjects.filter(o => o.type === 'wall').map(o => {
            const obj = OBJECTS.find(obj => obj.id === o.id);
            const panResponder = getPanResponder(o);
            const resizeResponder = getResizeResponder(o);
            return (
              <View
                key={o.id}
                style={[
                  styles.object,
                  {
                    top: o.position.y,
                    left: o.position.x,
                    width: o.size?.width || 60,
                    height: o.size?.height || 60,
                  }
                ]}
                {...panResponder.panHandlers}
              >
                <Image
                  source={obj.image}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
                <View
                  style={styles.resizeHandle}
                  {...resizeResponder.panHandlers}
                />
              </View>
            );
          })}
        </View>
        <View style={styles.floor}>
          {placedObjects.filter(o => o.type === 'floor').map(o => {
            const obj = OBJECTS.find(obj => obj.id === o.id);
            return (
              <Image key={o.id} source={obj.image} style={[styles.object, { top: o.position.y, left: o.position.x }]} />
            );
          })}
        </View>
      </View>
      <Text style={styles.subtitle}>Inventário</Text>
      <FlatList
        data={inventory}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.invCard} onPress={() => handlePlace(item)}>
            <Image source={item.image} style={styles.invImage} />
            <Text>{item.name}</Text>
            <Text>{item.type === 'wall' ? 'Parede' : 'Chão'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  room: { flex: 1, borderWidth: 2, borderColor: '#aaa', borderRadius: 10, marginBottom: 10, backgroundColor: '#e0f7fa' },
  wall: { flex: 2, position: 'relative' },
  floor: { flex: 1, position: 'relative', backgroundColor: '#ffe0b2' },
  object: { position: 'absolute' },
  resizeHandle: {
    position: 'absolute',
    right: 0, bottom: 0,
    width: 20, height: 20,
    backgroundColor: '#ffd700',
    borderRadius: 10,
    zIndex: 2,
  },
  subtitle: { fontWeight: 'bold', marginTop: 10 },
  invCard: { backgroundColor: '#fff', padding: 8, margin: 8, borderRadius: 8, alignItems: 'center' },
  invImage: { width: 32, height: 32, marginBottom: 4 },
});
