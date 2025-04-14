import React from "react";
import { useNavigate } from "react-router-dom";

const RptActions = ({ value, row, columnMeta, Drpoptions }) => {
  const [openDrop, setopenDrop] = useState(false);
  var kebab = document.querySelector(".kebab"),
    middle = document.querySelector(".middle"),
    cross = document.querySelector(".cross"),
    dropdown = document.querySelector(".dropdown");

  kebab.addEventListener("click", function () {
    middle.classList.toggle("active");
    cross.classList.toggle("active");
    dropdown.classList.toggle("active");
  });

  let navigate = useNavigate();
  let objectId = row.original[columnMeta.id_column_name];

  return (
    <div className="d-flex flex-grow-1">
      {/* <FontAwesomeIcon icon={faFile} className="me-2 ms-2" /> */}
      {/* <a
        onClick={() => navigate(`/form/runtime?formService=${columnMeta.form}&objectId=${objectId}`)}
  
        target="_blank"
        rel="noopener noreferrer"
        className="me-2"
      >
        {value}
      </a> */}

      <div className="kebab" onClick={() => setopenDrop(true)}>
        <figure></figure>
        <figure className="middle"></figure>
        {/* <p class="cross">x</p> */}
        <figure></figure>
      </div>
      {openDrop == true && (
        <div className="dropvalues">
          {/* <li><a href="http://www.g.com">Accept Incident</a></li>
          <li><a href="http://www.g.com">Reject Incident</a></li> */}
          {Drpoptions.map((item) => {
            return (
              <ul style={{ paddingLeft: "0.5rem", marginBottom: "0rem" }}>
                <li>
                  <a href="">{item.displayname}</a>
                </li>
              </ul>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RptActions;
