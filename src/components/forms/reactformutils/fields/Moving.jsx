import React, { useState } from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";

function Moving() {
  //   const { fieldnames } = props;
  const [listA, setListA] = useState(["item1", "item2", "item3"]); //list of items present in A
  const [listB, setListB] = useState([]); //list of items present in B
  const [selectedItems, setSelectedItems] = useState([]); // user selected items

  const handleItemSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      ); //deselection takes place here
    } else {
      setSelectedItems([...selectedItems, item]); // selection takes place along with the exisiting selected items
    }
  };

  const moveItemsRight = () => {
    if (selectedItems) {
      setListA(listA.filter((item) => !selectedItems.includes(item))); // exculdes the selected items that are selected in the list A
      const filteredSelectedItems = selectedItems.filter(
        (item) => !listB.includes(item)
      ); // exculdes the items that are present in the list B//avoids the duplications
      setListB([...listB, ...filteredSelectedItems]); // using the spread i am setting the values to the list B
      setSelectedItems([]);
    }
  };
  const moveItemsLeft = () => {
    if (selectedItems) {
      setListB(listB.filter((item) => !selectedItems.includes(item))); // check above vice versa
      const filteredSelectedItems = selectedItems.filter(
        (item) => !listA.includes(item)
      );
      setListA([...listA, ...filteredSelectedItems]);
      setSelectedItems([]);
    }
  };

  const moveAll = () => {
    setListB([...listB, ...listA]); //moving all items from list A to list B
    setListA([]); //after moving from A setting A to empty
  };
  const moveAllLeft = () => {
    setListA([...listA, ...listB]); //moving all items from from list B to list A
    setListB([]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>List A</h2>
          <ListGroup>
            {listA.map((item) => (
              <ListGroup.Item
                key={item}
                onClick={() => handleItemSelect(item)}
                active={selectedItems.includes(item)}
                action
              >
                {item}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          <h2>List B</h2>
          <ListGroup>
            {listB.map((item) => (
              <ListGroup.Item
                key={item}
                onClick={() => handleItemSelect(item)}
                active={selectedItems.includes(item)}
                action
              >
                {item}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" onClick={moveItemsRight}>
            Move Selected right
          </Button>
          <Button variant="primary" onClick={moveItemsLeft}>
            Move Selected left
          </Button>
          <Button variant="success" onClick={moveAll}>
            Move All right
          </Button>
          <Button variant="success" onClick={moveAllLeft}>
            Move All LEFT
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Moving;
