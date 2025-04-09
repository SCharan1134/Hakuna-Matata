import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useImperativeHandle } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const SNAP_POINTS = {
  FULL: MAX_TRANSLATE_Y,
  HALF: -SCREEN_HEIGHT / 2,
  QUARTER: -SCREEN_HEIGHT / 4,
  MINI: -SCREEN_HEIGHT / 6,
  CLOSED: 0,
};

type BottomSheetProps = {
  children?: React.ReactNode;
  // translateY: SharedValue<number>;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback(
      (destination: number) => {
        "worklet";
        active.value = destination !== 0;
        translateY.value = withSpring(destination, { damping: 50 });
      },
      [translateY]
    );

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        "worklet";

        const positions = [
          SNAP_POINTS.FULL,
          SNAP_POINTS.HALF,
          SNAP_POINTS.QUARTER,
          SNAP_POINTS.MINI,
          SNAP_POINTS.CLOSED,
        ];

        const currentY = translateY.value;

        // Find the closest snap point
        let closestPoint = positions[0];
        let minDistance = Math.abs(currentY - closestPoint);

        for (let i = 1; i < positions.length; i++) {
          const distance = Math.abs(currentY - positions[i]);
          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = positions[i];
          }
        }

        scrollTo(closestPoint);
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [
          SNAP_POINTS.FULL,
          SNAP_POINTS.HALF,
          SNAP_POINTS.QUARTER,
          SNAP_POINTS.MINI,
          SNAP_POINTS.CLOSED,
        ],
        [10, 15, 20, 25],
        Extrapolate.CLAMP
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <GestureDetector gesture={gesture}>
          <View className="w-full  h-12">
            <View style={styles.line} />
          </View>
        </GestureDetector>
        {children}
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    zIndex: 1000,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
});

export default BottomSheet;

export { SNAP_POINTS };
