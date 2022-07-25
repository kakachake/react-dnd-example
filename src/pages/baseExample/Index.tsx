import { FC, useState } from "react";
import { useDrag, useDragLayer, useDrop } from "react-dnd";
import "./Index.css";
type Item = {
  _id: string;
  isDraged?: boolean;
  onremoveCb?: () => void;
};

interface IndexProps {}

function Box({ _id, isDraged = false, onremoveCb }: Item) {
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
        const msg = (monitor.getDropResult() as any)?.msg;
        if (msg === "remove") {
          onremoveCb && onremoveCb();
        }
      },
    };
  }, [_id]);

  return (
    <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="box" role="handle" ref={drag}>
        ♘{_id}
      </div>
    </div>
  );
}

function Bucket() {
  const [itemList, setItemList] = useState<any[]>([]);
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
        console.log(item);
        if (item.isDraged) return;
        setItemList([...itemList, item.id]);
        return {
          msg: "drop success",
        };
      },
    }),
    [itemList]
  );
  function removeItem(idx: number) {
    setItemList(itemList.filter((_, i) => i !== idx));
  }
  return (
    <div
      ref={drop}
      role={"Dustbin"}
      className={"drop-zone"}
      style={{
        backgroundColor: isOver ? "rgba(211, 64, 64, 0.467)" : "white",
      }}
    >
      {canDrop ? <div>放入</div> : <div>拖拽</div>}
      <div
        style={{
          display: "flex",
        }}
      >
        {itemList.map((id, idx) => (
          <Box
            key={idx}
            _id={id}
            isDraged={true}
            onremoveCb={() => removeItem(idx)}
          />
        ))}
      </div>
    </div>
  );
}

function DragLayerComponent(props: any) {
  const collectedProps = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));
  return (
    <div className="drag-layer" style={{}}>
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
        backgroundColor: isOver ? "rgba(211, 64, 64, 0.467)" : "white",
      }}
    >
      {canDrop && <h1>删除该元素</h1>}
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
      <DragLayerComponent />
    </div>
  );
};

export default Index;
