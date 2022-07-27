import { relative } from "path";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useDrag, useDragLayer, useDrop } from "react-dnd";
import update from "immutability-helper";
import "./Index.css";
type Item = {
  _id: string;
  isDraged?: boolean;
  onremoveCb?: () => void;
  left?: number;
  top?: number;
};

interface IndexProps {}

function Box({ _id, isDraged = false, onremoveCb, left, top }: Item) {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => {
    return {
      type: "BOX",
      item: {
        id: _id,
        isDraged,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        console.log(item);
        console.log(monitor.didDrop());
        console.log(monitor.getDropResult());

        const msg = (monitor.getDropResult() as any)?.msg;
        if (msg === "remove") {
          onremoveCb && onremoveCb();
        }
      },
    };
  }, [_id]);

  return (
    <div
      ref={dragPreview}
      style={{
        opacity: isDragging ? 0.5 : 1,
        position: isDraged ? "absolute" : "relative",
        left: left ? left + "px" : 0,
        top: top ? top + "px" : 0,
      }}
    >
      <div className="box" role="handle" ref={drag}>
        ♘{_id}
      </div>
    </div>
  );
}

function Bucket() {
  const [itemList, setItemList] = useState<any[]>([]);
  const offset = useRef<{
    x: number;
    y: number;
  } | null>();
  const [{ canDrop, isOver }, drop] = useDrop<
    {
      id: string;
      isDraged: boolean;
    },
    {},
    {
      canDrop: boolean;
      isOver: boolean;
    }
  >(
    () => ({
      accept: "BOX",
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop: (item, monitor) => {
        const delta = monitor.getSourceClientOffset();
        console.log(offset.current);
        console.log(delta);

        if (item.isDraged) {
          const idx = itemList.findIndex((value) => value.id === item.id);
          setItemList(
            update(itemList, {
              [idx]: {
                $merge: {
                  id: item.id,
                  left: delta!.x - offset.current!.x,
                  top: delta!.y - offset.current!.y,
                },
              },
            })
          );
        } else {
          setItemList([
            ...itemList,
            {
              id: item.id + Math.floor(Math.random() * 9999),
              left: delta!.x - offset.current!.x,
              top: delta!.y - offset.current!.y,
            },
          ]);
        }
        return {
          msg: "drop success",
        };
      },
    }),
    [itemList]
  );
  useEffect(() => {
    const dropArea = document.getElementById("dropArea");
    offset.current = {
      x: dropArea!.offsetLeft,
      y: dropArea!.offsetTop,
    };
  }, []);
  const removeItem = useCallback(
    (id: number) => {
      setItemList(itemList.filter((_, i) => _.id !== id));
    },
    [itemList]
  );

  return (
    <div
      ref={drop}
      role={"Dustbin"}
      className={"drop-zone"}
      style={{
        backgroundColor: isOver ? "rgba(211, 64, 64, 0.467)" : "white",
        height: "400px",
        boxSizing: "border-box",
      }}
    >
      {canDrop ? <div>放入</div> : <div>拖拽</div>}
      <DragLayerComponent />
      <div
        id="dropArea"
        style={{
          position: "relative",
        }}
      >
        {itemList.map((item, idx) => (
          <Box
            key={idx}
            _id={item.id}
            left={item.left}
            top={item.top}
            isDraged={true}
            onremoveCb={() => removeItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function DragLayerComponent(props: any) {
  const layerStyles = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
  };
  const collectedProps = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));
  function getItemStyles(initialOffset: any, currentOffset: any) {
    if (!initialOffset || !currentOffset) {
      return {
        // display: "none",
      };
    }
    let { x, y } = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
      width: "200px",
      height: "200px",
    };
  }
  return (
    <div className="drag-layer" style={layerStyles as React.CSSProperties}>
      <div
        style={getItemStyles(
          collectedProps.initialOffset,
          collectedProps.currentOffset
        )}
      >
        {collectedProps.item && (
          <div>
            <div>{collectedProps.item.id}</div>
            <div>{collectedProps.itemType?.toString()}</div>
            <div>currentOffset.x:{collectedProps.currentOffset?.x}</div>
            <div>currentOffset.y:{collectedProps.currentOffset?.y}</div>
            <div>initialOffset.x{collectedProps.initialOffset?.x}</div>
            <div>initialOffset.y{collectedProps.initialOffset?.y}</div>
            <div>{collectedProps.isDragging}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteBucket() {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "BOX",
    collect: (monitor) => ({
      isOver: (() => {
        const item: Item = monitor.getItem();
        if (!item) return false;
        if (item.isDraged && monitor.isOver()) return true;
        return false;
      })(),
      // isOver: monitor.isOver(),
      canDrop: (() => {
        const item: Item = monitor.getItem();
        if (!item) return false;
        if (item.isDraged && monitor.canDrop()) return true;
        return false;
      })(),
    }),
    drop: (item) => {
      console.log(item);
      return {
        msg: "remove",
      };
    },
  }));
  return (
    <div
      ref={drop}
      role={"Dustbin"}
      className={"drop-zone"}
      style={{
        position: "relative",
        backgroundColor: isOver ? "rgba(211, 64, 64, 0.467)" : "white",
      }}
    >
      {canDrop && <h1>删除该元素</h1>}
      删除
    </div>
  );
}

const Index: FC<IndexProps> = () => {
  return (
    <div>
      <Box _id="1" />
      <Box _id="2" />
      <Box _id="3" />
      <Box _id="4" />

      <Bucket />
      <DeleteBucket />
    </div>
  );
};

export default Index;
