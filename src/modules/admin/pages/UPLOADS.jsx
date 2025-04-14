import ReportRuntime from "src/components/reports/Report";

import DataImports from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
let BankDetail = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={
            <DataImports formService="dataimports" offCanvas objectId={-1} />
          }
          title="Data Imports"
        />
      </div>

      <ReportRuntime report="DATA_IMPORTS" />
    </>
  );
};

export default BankDetail;
