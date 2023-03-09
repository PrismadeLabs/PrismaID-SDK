import { useLocation, useNavigate } from "react-router-dom";

const withRouter = (WrappedComponent: any) => (props: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  return <WrappedComponent {...props} navigate={navigate} location={location} />;
};

export default withRouter;
