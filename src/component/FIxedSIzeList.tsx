import {createListComponent} from "./createListComponent", 
import {Props,ScrollToAlign} from "./createListComponent";

const FixedSizeList = createListComponent<any>({
  getItemOffset: ({ itemSize }: Props<any>, index: number): number =>
    index * itemSize,

  getItemSize: ({ itemSize }: Props<any>, index: number): number => itemSize,

  getEstimatedTotalSize: ({ itemCount, itemSize }: Props<any>): number =>
    itemSize * itemCount,

  getOffsetForIndexAndAlignment: (
    { direction, height, itemCount, itemSize, layout, width }: Props<any>,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number,
    instanceProps: any,
    scrollbarSize: number
  ): number => {
    const isHorizontal = direction === "horizontal" || layout === "horizontal";
    const size = isHorizontal ? width : height;
    const lastItemOffset = Math.max(0, itemCount * itemSize - size);
    const maxOffset = Math.min(lastItemOffset, index * itemSize);
    const minOffset = Math.max(
      0,
      index * itemSize - size + itemSize + scrollbarSize
    );

    if (align === "smart") {
      if (
        scrollOffset >= minOffset - size &&
        scrollOffset <= maxOffset + size
      ) {
        align = "auto";
      } else {
        align = "center";
      }
    }

    switch (align) {
      case "start":
        return maxOffset;
      case "end":
        return minOffset;
      case "center": {
        const middleOffset = Math.round(
          minOffset + (maxOffset - minOffset) / 2
        );
        if (middleOffset < Math.ceil(size / 2)) {
          return 0; // near the beginning
        } else if (middleOffset > lastItemOffset + Math.floor(size / 2)) {
          return lastItemOffset; // near the end
        } else {
          return middleOffset;
        }
      }
      case "auto":
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },

  getStartIndexForOffset: (
    { itemCount, itemSize }: Props<any>,
    offset: number
  ): number =>
    Math.max(0, Math.min(itemCount - 1, Math.floor(offset / itemSize))),

  getStopIndexForStartIndex: (
    { direction, height, itemCount, itemSize, layout, width }: Props<any>,
    startIndex: number,
    scrollOffset: number
  ): number => {
    const isHorizontal = direction === "horizontal" || layout === "horizontal";
    const offset = startIndex * itemSize;
    const size = isHorizontal ? width : height;
    const numVisibleItems = Math.ceil(
      (size + scrollOffset - offset) / itemSize
    );
    return Math.max(
      0,
      Math.min(itemCount - 1, startIndex + numVisibleItems - 1)
    );
  },

  initInstanceProps: () => ({}),

  shouldResetStyleCacheOnItemSizeChange: true,

  validateProps: ({ itemSize }: Props<any>): void => {
    if (process.env.NODE_ENV !== "production") {
      if (typeof itemSize !== "number") {
        throw new Error(
          'An invalid "itemSize" prop has been specified. ' +
            "Value should be a number. " +
            `"${itemSize === null ? "null" : typeof itemSize}" was specified.`
        );
      }
    }
  },
});

export default FixedSizeList;
