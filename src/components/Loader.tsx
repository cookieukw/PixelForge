
/* Components */
import CircleLoader from "../anim/loaders/CircleLoader";
import FlipLoader from "../anim/loaders/FlipLoader";
import ScaleLoader from "../anim/loaders/ScaleLoader";
import EllipsisLoader from "../anim/loaders/EllipsisLoader";
import FaceBookLoader from "../anim/loaders/FaceBookLoader";
import RingLoader from "../anim/loaders/RingLoader";
import GridLoader from "../anim/loaders/GridLoader";
import RippleLoader from "../anim/loaders/RippleLoader";
import RotateLoader from "../anim/loaders/RotateLoader";
import BoxLoader from "../anim/loaders/BoxLoader";
import ClimbLoader from "../anim/loaders/ClimbLoader";
import BlockLoader from "../anim/loaders/BlockLoader";

interface LoaderProps {
  color:string
}
const Loader:React.FC<LoaderProps> = ({ color }) => {
  const random = Math.floor(Math.random() * 11);
  const renderLoad = () => {
    switch (random) {
      case 0:
        return <ClimbLoader color={color} />;
      case 1:
        return <RippleLoader color={color} />;
      case 2:
        return <GridLoader color={color} />;
      case 3:
        return <RotateLoader color={color} />;
      case 4:
        return <RingLoader color={color} />;
      case 5:
        return <EllipsisLoader color={color} />;
      case 6:
        return <FaceBookLoader color={color} />;
      case 7:
        return <BoxLoader color={color} />;
      case 8:
        return <ScaleLoader color={color} />;
      case 9:
        return <CircleLoader color={color} />;
      case 10:
        return <BlockLoader color={color} />;
      case 11:
        return <FlipLoader color={color} />;
      default:
        return;
    }
  };
  return <div id="base">{renderLoad()}</div>;
};
export default Loader;
