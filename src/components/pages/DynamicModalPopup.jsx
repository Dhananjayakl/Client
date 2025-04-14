import React, { useState } from "react";
import {
  Modal,
  InputGroup,
  Form,
  Table,
  Button,
  Pagination,
} from "react-bootstrap";

const DynamicModalPopup = ({
  show,
  onHide,
  title,
  label,
  options = [],
  buttonLabel,
  source,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const recordsPerPage = 10;

  const searchHandle = (e) => setSearchValue(e.target.value);

  // Handle selection of multiple options
  const handleSelectOption = (id) => {
    setSelectedOptions(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((optionId) => optionId !== id) // Deselect
          : [...prevSelected, id] // Select
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOptions([]); // Deselect all
    } else {
      const allIds = filteredOptions.map(
        (item) => item.object_id || item.business_entity_id
      );
      setSelectedOptions(allIds); // Select all
    }
    setSelectAll(!selectAll); // Toggle the select all state
  };

  const handleClose = () => {
    setSelectedOptions([]); // Reset selection on close
    setSearchValue("");
    setCurrentPage(1);
    setSelectAll(false); // Reset select all on close
    onHide();
  };

  const handleSelect = () => {
    const selected = selectedOptions.map((selectedId) =>
      options.find(
        (opt) =>
          opt.object_id === selectedId || opt.business_entity_id === selectedId
      )
    );

    const selectedDetails = selected.map((item) => ({
      value: item.object_id || item.business_entity_id,
      label: item?.name || item?.deliverable || item?.business_entity_name,
    }));

    // Pass selected options back to the parent component
    onHide(selectedDetails, label, source, options);

    handleClose();
  };

  const filteredOptions = Array.isArray(options)
    ? options.filter(
        (item) =>
          (item.name &&
            item.name.toLowerCase().includes(searchValue.toLowerCase())) ||
          (item.deliverable &&
            item.deliverable
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
          (item.business_entity_name &&
            item.business_entity_name
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
      )
    : [];

  const totalPages = Math.ceil(filteredOptions.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedOptions = filteredOptions.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // Pagination logic to limit the page numbers shown to 10
  const pageLimit = 10;
  const startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
  const endPage = Math.min(totalPages, startPage + pageLimit - 1);
  const pagesToShow = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <Modal size="md" show={show} onHide={handleClose}>
      <Modal.Header className="text-dark">
        <h4 className="mt-3">{title}</h4>
        <Button variant="primary" onClick={handleSelect}>
          {buttonLabel}
        </Button>
      </Modal.Header>
      <Modal.Body className="overflow-auto">
        <InputGroup size="md" className="mb-3">
          <Form.Control
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchValue}
            onChange={searchHandle}
          />
        </InputGroup>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>{label}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOptions.map((item, index) => (
              <tr key={index}>
                <td>
                  <Form.Check
                    size="sm"
                    type="checkbox"
                    name="selectedOption"
                    checked={
                      selectedOptions.includes(item.object_id) ||
                      selectedOptions.includes(item.business_entity_id)
                    }
                    onChange={() =>
                      handleSelectOption(
                        item.object_id || item.business_entity_id
                      )
                    }
                  />
                </td>
                <td>
                  {item.name || item.deliverable || item.business_entity_name}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {pagesToShow.map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default DynamicModalPopup;
