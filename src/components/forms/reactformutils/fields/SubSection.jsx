import { useTranslation } from "react-i18next";
let SubSection = (props) => {
  const { t } = useTranslation("common");
  return (
    <div className="card ">
      <div
        className={`card-header px-0 form-section ${props.headerClass}`}
        // onClick={handleToggle}
      >
        <span className="h5"> {t(props.title)}</span>
        <hr className="m-0" />
      </div>
      {/* <div id={props.id} className={`collapse ${isCollapsed ? "show" : " "}`}> */}
      <div className="card-body px-0">{props.children}</div>
      {/* </div> */}
    </div>
  );
};

export default SubSection;
