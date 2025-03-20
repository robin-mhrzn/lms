import ListComponent from "../../components/category/list.Component";
import { useParams } from "react-router-dom";
const Category = () => {
  const { parentId, parentName } = useParams();
  return (
    <>
      <ListComponent
        parentId={parentId != undefined ? Number(parentId) : undefined}
        name={parentName}
      />
      ;
    </>
  );
};
export default Category;
