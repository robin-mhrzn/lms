import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useEffect, useMemo } from "react";
import { fetchParentCategories } from "../../../redux/reducer/categoryReducer";
export interface ParentCategoryProps {
  onChange?: (value: number) => void;
}
const ParentCategory: React.FC<ParentCategoryProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const parentCategories = useSelector(
    (state: RootState) => state.category.parentCategories
  );
  useEffect(() => {
    if (parentCategories.length === 0) {
      dispatch(fetchParentCategories());
    }
  }, [parentCategories]);
  const parentOptions = useMemo(
    () => parentCategories.map((a) => ({ value: a.categoryId, label: a.name })),
    [parentCategories]
  );

  return (
    <Select
      onChange={props.onChange}
      showSearch
      placeholder="Select a category"
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={parentOptions}
    />
  );
};

export default ParentCategory;
