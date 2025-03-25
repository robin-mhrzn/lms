import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useEffect, useMemo } from "react";
import { fetchCourseLevel } from "../../../redux/reducer/courseLevelReducer";
export interface CourseLevelSelectProps {
  onChange?: (value: number) => void;
  value?: number;
}
const CourseLevelSelect: React.FC<CourseLevelSelectProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const courselevels = useSelector(
    (state: RootState) => state.courseLevel?.courseLevel || []
  );
  useEffect(() => {
    if (!courselevels.length) {
      dispatch(fetchCourseLevel());
    }
  }, [courselevels]);
  const options = useMemo(
    () => courselevels?.map((a) => ({ value: a.levelId, label: a.name })),
    [courselevels]
  );

  return (
    <Select
      value={props.value}
      onChange={props.onChange}
      showSearch
      placeholder="Select a category"
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={options}
    />
  );
};

export default CourseLevelSelect;
