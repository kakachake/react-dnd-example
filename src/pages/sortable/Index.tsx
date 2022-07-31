import { FC, useCallback, useState } from "react";
import update from "immutability-helper";
import Card from "./Card";
import { useDragDropManager, useDragLayer } from "react-dnd";

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}
const Index = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: "Write a cool JS library",
    },
    {
      id: 2,
      text: "Make it generic enough",
    },
    {
      id: 3,
      text: "Write README",
    },
    {
      id: 4,
      text: "Create some examples",
    },
    {
      id: 5,
      text: "Spam in Twitter and IRC to promote it (note that this element is taller than the others)",
    },
    {
      id: 6,
      text: "???",
    },
    {
      id: 7,
      text: "PROFIT",
    },
  ]);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: Item[]) => {
      return update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as Item],
        ],
      });
    });
  }, []);
  const collectedProps = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));
  console.log(collectedProps);

  return (
    <div>
      {cards.map((card, idx) => {
        return (
          <Card
            isDraggingGloble={collectedProps.isDragging}
            draggingItemId={collectedProps.item?.id || ""}
            key={card.id}
            id={card.id}
            index={idx}
            text={card.text}
            moveCard={moveCard}
          />
        );
      })}
    </div>
  );
};
export default Index;
