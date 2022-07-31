import { FC, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};
export interface CardProps {
  id: any;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  isDraggingGloble: boolean;
  draggingItemId: any;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const Card: FC<CardProps> = ({
  id,
  text,
  index,
  moveCard,
  isDraggingGloble,
  draggingItemId,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "card",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return;
      // 获取当前拖拽元素的下标
      const dragIndex = item.index;

      // 获取悬浮元素的下标
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      //获取当前悬浮元素的边界信息
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // 获取当前元素一半的高度
      const hoverMiddleY = hoverBoundingRect.height / 2;

      const clientOffset = monitor.getClientOffset();

      // 获取当前鼠标位置距离当前元素顶部的偏移
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // 如果拖拽元素在当前元素上方，且偏移小于当前元素一半的高度，则不需要移动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // 如果拖拽元素在当前元素下方，且偏移大于当前元素一半的高度，也不需要移动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      //这里将拖拽元素的index立即改变，防止抖动产生
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return {
        id,
        index,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  const opacity = isDragging ? 0.5 : 1;
  const positionStyle =
    isDraggingGloble && draggingItemId !== id
      ? {
          position: "relative",
        }
      : {};
  console.log(isDraggingGloble, draggingItemId, id);

  return (
    <div
      ref={ref}
      style={{ ...style, opacity, ...(positionStyle as any) }}
      data-handler-id={handlerId}
    >
      {text}
      {opacity}
    </div>
  );
};

export default Card;
