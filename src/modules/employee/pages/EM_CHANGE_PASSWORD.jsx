import { lazy } from "@loadable/component";

const ChangePassword = lazy(() => import("../../admin/forms/ChangePassword"));

let ChangePwd = () => {
  return (
    <>
      <ChangePassword />
    </>
  );
};

export default ChangePwd;
