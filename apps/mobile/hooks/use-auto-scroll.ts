import { useCallback, useRef, useState } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";

type UseAutoScrollReturn = {
  ref: React.RefObject<ScrollView | null>;
  isAtBottom: boolean;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onContentSizeChange: (w: number, h: number) => void;
  scrollToEndManually: () => void;
};

export function useAutoScroll(): UseAutoScrollReturn {
  const ref = useRef<ScrollView | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [userLocked, setUserLocked] = useState(false);

  const scrollToEnd = useCallback((reason: string) => {
    const view = ref.current;
    if (!view) {
      console.log("[AUTO-SCROLL] scrollToEnd: no ref");
      return;
    }
    console.log("[AUTO-SCROLL] scrollToEnd", reason);
    view.scrollToEnd({ animated: true });
  }, []);

  const scrollToEndManually = useCallback(() => {
    setUserLocked(false);
    scrollToEnd("manual button");
  }, [scrollToEnd]);

  const onContentSizeChange = useCallback(
    (w: number, h: number) => {
      console.log(
        "[AUTO-SCROLL] onContentSizeChange",
        JSON.stringify({ w, h, isAtBottom, userLocked }),
      );
      if (!userLocked && isAtBottom) {
        scrollToEnd("content size change");
      }
    },
    [isAtBottom, userLocked, scrollToEnd],
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;

    const thresholdBottom = 20;
    const atBottom = distanceFromBottom < thresholdBottom;

    if (atBottom !== isAtBottom) {
      console.log(
        "[AUTO-SCROLL] onScroll isAtBottom",
        JSON.stringify(
          {
            distanceFromBottom,
            thresholdBottom,
            atBottom,
            prevIsAtBottom: isAtBottom,
          },
          null,
          2,
        ),
      );
      setIsAtBottom(atBottom);
    }

    const thresholdLock = 80;
    const userScrolledUp = distanceFromBottom > thresholdLock;

    if (userScrolledUp && !userLocked) {
      console.log(
        "[AUTO-SCROLL] onScroll: user scrolled up, locking autoscroll",
        JSON.stringify({ distanceFromBottom, thresholdLock }, null, 2),
      );
      setUserLocked(true);
    }
  };

  return {
    ref,
    isAtBottom,
    onScroll,
    onContentSizeChange,
    scrollToEndManually,
  };
}
