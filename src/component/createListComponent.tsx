import React, { PureComponent } from 'react';

// 基础类型定义
export type ScrollToAlign = 'auto' | 'smart' | 'center' | 'start' | 'end';
export type Direction = 'ltr' | 'rtl';
export type Layout = 'horizontal' | 'vertical';

// 渲染组件的Props类型
export interface RenderComponentProps<T> {
  data: T;
  index: number;
  isScrolling?: boolean;
  style: React.CSSProperties;
}

// 列表组件的Props类型
export interface ListProps<T> {
  children: React.ComponentType<RenderComponentProps<T>>;
  className?: string;
  direction?: Direction;
  height: number;
  width: number;
  itemCount: number;
  itemData?: T;
  itemSize: number;
  layout?: Layout;
  overscanCount?: number;
  style?: React.CSSProperties;
  initialScrollOffset?: number;
}

// 列表组件的状态类型
interface ListState {
  scrollOffset: number;
  isScrolling: boolean;
}

// 列表组件配置接口
interface ListComponentConfig<T> {
  getItemOffset: (props: ListProps<T>, index: number) => number;
  getItemSize: (props: ListProps<T>, index: number) => number;
  getEstimatedTotalSize: (props: ListProps<T>) => number;
  getOffsetForIndexAndAlignment: (
    props: ListProps<T>,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number
  ) => number;
  getStartIndexForOffset: (props: ListProps<T>, offset: number) => number;
  getStopIndexForStartIndex: (
    props: ListProps<T>,
    startIndex: number,
    scrollOffset: number
  ) => number;
  validateProps: (props: ListProps<T>) => void;
}

// 创建列表组件的高阶函数
export function createListComponent<T>(config: ListComponentConfig<T>): 
  React.ComponentType<ListProps<T>> {
  return class VirtualList extends PureComponent<ListProps<T>, ListState> {
    static defaultProps = {
      direction: 'ltr',
      layout: 'vertical',
      overscanCount: 2,
      initialScrollOffset: 0,
    };

    state: ListState = {
      scrollOffset: this.props.initialScrollOffset || 0,
      isScrolling: false,
    };

    private containerRef = React.createRef<HTMLDivElement>();

    constructor(props: ListProps<T>) {
      super(props);
      config.validateProps(props);
    }

    private calculateVisibleRange(): [number, number] {
      const { itemCount, itemSize } = this.props;
      const { scrollOffset } = this.state;

      const startIndex = Math.floor(scrollOffset / itemSize);
      const endIndex = Math.min(
        itemCount - 1, 
        Math.floor((scrollOffset + this.getContainerHeight()) / itemSize)
      );

      return [startIndex, endIndex];
    }

    private getContainerHeight(): number {
      return this.props.height;
    }

    private renderItems(): React.ReactNode[] {
      const { children: ChildComponent, itemCount, itemData } = this.props;
      const [startIndex, endIndex] = this.calculateVisibleRange();

      return Array.from({ length: endIndex - startIndex + 1 }, (_, i) => {
        const index = startIndex + i;
        const offset = config.getItemOffset(this.props, index);

        return (
          <ChildComponent
            key={index}
            index={index}
            data={itemData}
            style={{
              position: 'absolute',
              top: offset,
              height: this.props.itemSize,
              width: '100%',
            }}
          />
        );
      });
    }

    private handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop;
      this.setState({ 
        scrollOffset: scrollTop,
        isScrolling: true 
      });

      // 防抖处理滚动状态
      setTimeout(() => {
        this.setState({ isScrolling: false });
      }, 150);
    }

    render() {
      const { height, width, style } = this.props;
      const totalHeight = config.getEstimatedTotalSize(this.props);

      return (
        <div
          ref={this.containerRef}
          style={{
            height,
            width,
            overflow: 'auto',
            position: 'relative',
            ...style,
          }}
          onScroll={this.handleScroll}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            {this.renderItems()}
          </div>
        </div>
      );
    }
  };
}