import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/Navigation";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => navigate(PATHS.LANDINGPAGE)}>
          Back Home
        </Button>
      }
    />
  );
};

export default Unauthorized;
