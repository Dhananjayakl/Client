import { useContext } from "react";
import {CollapseContext} from '../contexts/SectionProvider'

 const useCollapseContext = () => {
    return useContext(CollapseContext);
  };
  

  export default useCollapseContext;