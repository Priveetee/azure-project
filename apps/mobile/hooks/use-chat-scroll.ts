import { useCallback, useEffect, useRef, useState } from "react";
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import type { Message } from "@meowww/shared";

type UseChatScrollReturn = {
  flatListRef: React.RefObject<FlatList<Message> | null>;
  isAtBottom: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollToBottom: () => void;
};

export function useChatScroll(messages: Message[]): UseChatScrollReturn {
  const flatListRef = useRef<FlatList<Message> | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (!messages.length) return;
    const lastIndex = messages.length - 1;
    const list = flatListRef.current;
    if (!list) return;
    list.scrollToIndex({
      index: lastIndex,
      animated: true,
    });
  }, [messages.length]);

  const previousLengthRef = useRef(0);

  useEffect(() => {
    const prevLength = previousLengthRef.current;
    const newLength = messages.length;
    previousLengthRef.current = newLength;

    const hasNewMessage = newLength > prevLength;
    if (hasNewMessage && isAtBottom && newLength > 0) {
      scrollToBottom();
    }
  }, [messages.length, isAtBottom, scrollToBottom]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    const atBottom = distanceFromBottom < 100;
    if (atBottom !== isAtBottom) {
      setIsAtBottom(atBottom);
    }
  };

  return {
    flatListRef,
    isAtBottom,
    handleScroll,
    scrollToBottom,
  };
}
