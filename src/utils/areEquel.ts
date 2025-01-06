import shallowDiffers from "./shallowDiffers";

/**
 * @param {Record<string, any>} prevProps
 * @param {Record<string, any>} nextProps
 * @returns {boolean} 如果两个 props 对象相等则返回 true，否则返回 false。
 */
export default function areEqual(
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
): boolean {
  const { style: prevStyle, ...prevRest } = prevProps;
  const { style: nextStyle, ...nextRest } = nextProps;

  // 如果 prevStyle 和 nextStyle 没有浅层差异，并且 prevRest 和 nextRest 也没有浅层差异，则返回 true
  return (
    !shallowDiffers(prevStyle, nextStyle) && !shallowDiffers(prevRest, nextRest)
  );
}
