let size: number = -1;

/**
 * 获取滚动条的大小
 * 该工具函数从 "dom-helpers" 包中复制而来
 * @param {boolean} recalculate - 是否重新计算滚动条大小，默认为 false
 * @returns {number} 滚动条的大小
 */
export function getScrollbarSize(recalculate: boolean = false): number {
  // 如果 size 为 -1 或者 recalculate 为 true，则重新计算滚动条大小
  if (size === -1 || recalculate) {
    const div = document.createElement("div");
    const style = div.style;
    style.width = "50px";
    style.height = "50px";
    style.overflow = "scroll";
    document.body.appendChild(div);
    size = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  }
  return size;
}

/**
 * RTL（从右到左）偏移类型
 * @typedef {'negative' | 'positive-descending' | 'positive-ascending'} RTLOffsetType
 */
export type RTLOffsetType =
  | "negative"
  | "positive-descending"
  | "positive-ascending";

// 缓存的 RTL 结果，初始值为 null
let cachedRTLResult: RTLOffsetType | null = null;

/**
 * 获取 RTL 偏移类型
 * @param {boolean} recalculate - 是否重新计算 RTL 偏移类型，默认为 false
 * @returns {RTLOffsetType} RTL 偏移类型
 */
export function getRTLOffsetType(recalculate: boolean = false): RTLOffsetType {
  // 如果 cachedRTLResult 为 null 或者 recalculate 为 true，则重新计算 RTL 偏移类型
  if (cachedRTLResult === null || recalculate) {
    const outerDiv = document.createElement("div");
    const outerStyle = outerDiv.style;
    outerStyle.width = "50px";
    outerStyle.height = "50px";
    outerStyle.overflow = "scroll";
    outerStyle.direction = "rtl";

    const innerDiv = document.createElement("div");
    const innerStyle = innerDiv.style;
    innerStyle.width = "100px";
    innerStyle.height = "100px";
    outerDiv.appendChild(innerDiv);
    document.body.appendChild(outerDiv);
    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = "positive-descending";
    } else {
      outerDiv.scrollLeft = 1;
      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = "negative";
      } else {
        cachedRTLResult = "positive-ascending";
      }
    }

    document.body.removeChild(outerDiv);

    return cachedRTLResult;
  }

  return cachedRTLResult;
}
