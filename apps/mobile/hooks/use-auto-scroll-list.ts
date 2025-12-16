import { useCallback, useEffect, useRef, useState } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";

type UseAutoScrollParams = {
  itemCount: number;
};

type UseAutoScrollReturn = {
  ref: React.RefObject<ScrollView | null>;
  isAtBottom: boolean;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollToEnd: () => void;
};

export function useAutoScroll({
  itemCount,
}: UseAutoScrollParams): UseAutoScrollReturn {
  const ref = useRef<ScrollView | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToEnd = useCallback(() => {
    const view = ref.current;
    if (!view) {
      console.log("[AUTO-SCROLL] scrollToEnd: no ref");
      return;
    }
    console.log("[AUTO-SCROLL] scrollToEnd called, items:", itemCount);
    view.scrollToEnd({ animated: true });
  }, [itemCount]);

  const prevCountRef = useRef(0);

  useEffect(() => {
    const prev = prevCountRef.current;
    const next = itemCount;
    const hasNewItem = next > prev;
    prevCountRef.current = next;

    console.log(
      "[AUTO-SCROLL] effect",
      JSON.stringify({ prev, next, hasNewItem, isAtBottom }, null, 2),
    );

    if (!hasNewItem || next === 0) return;
    if (!isAtBottom) {
      console.log(
        "[AUTO-SCROLL] effect: new item but user not at bottom, skip autoscroll",
      );
      return;
    }

    scrollToEnd();
  }, [itemCount, isAtBottom, scrollToEnd]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;

    const threshold = 20;
    const atBottom = distanceFromBottom < threshold;

    if (atBottom !== isAtBottom) {
      console.log(
        "[AUTO-SCROLL] onScroll",
        JSON.stringify(
          {
            distanceFromBottom,
            threshold,
            atBottom,
            prevIsAtBottom: isAtBottom,
          },
          null,
          2,
        ),
      );
      setIsAtBottom(atBottom);
    }
  };

  return {
    ref,
    isAtBottom,
    onScroll,
    scrollToEnd,
  };
}
