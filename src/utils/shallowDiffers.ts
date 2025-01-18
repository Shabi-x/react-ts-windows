/**
 * 浅比较两个对象是否有差异
 * @param prev
 * @param next
 * @returns
 */
export default function shallowDiffers(
  prev: Record<string, any>,
  next: Record<string, any>
): boolean {
  for (let attribute in prev) {
    if (!(attribute in next)) {
      return true;
    }
  }
  for (let attribute in next) {
    if (prev[attribute] !== next[attribute]) {
      return true;
    }
  }
  return false;
}
