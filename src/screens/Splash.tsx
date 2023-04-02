/* Components */
import Avatar from "@mui/material/Avatar";
import Container from "../components/Container";
import Loader from "../components/Loader";

/* Functions */
import { useEffect } from "react";
import { useNavigate ,NavigateFunction} from "react-router-dom";

const Splash: React.FC = () => {
  const navigate:NavigateFunction = useNavigate();
  const color: string = "#fff";
  useEffect(() => {
    setTimeout(() => {
      navigate("/home");
    }, 2000);
  }, [navigate]);
  return (
    <Container
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        padding: "3rem",
        alignItems: "center",
        flexDirection: "column",
        rowGap: "10px",
      }}
    >
      <Avatar
        src={"/sun.png"}
        variant="square"
        sx={{ width: 50, height: 50, borderRadius: 4 }}
      />
      <Loader color={color} />
    </Container>
  );
};
export default Splash;
