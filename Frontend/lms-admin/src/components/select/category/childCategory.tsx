import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useEffect } from "react";
import { fetchChildCategories } from "../../../redux/reducer/categoryReducer";

interface ChildCategoryProps {
  parentCategoryId: number;
  onChange?: (value: number) => void;
  value?: number;
}

const ChildCategory: React.FC<ChildCategoryProps> = ({
  parentCategoryId,
  onChange,
  value,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const childCategories = useSelector(
    (state: RootState) => state.category.childCategories[parentCategoryId]
  );

  useEffect(() => {
    if (parentCategoryId > 0 && !childCategories) {
      dispatch(fetchChildCategories(parentCategoryId));
    }
  }, [dispatch, parentCategoryId]);

  return (
    <Select
      value={value}
      onChange={onChange}
      showSearch
      placeholder="Select a category"
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={(childCategories ?? []).map((a) => ({
        value: a.categoryId,
        label: a.name,
      }))}
    />
  );
};

export default ChildCategory;
