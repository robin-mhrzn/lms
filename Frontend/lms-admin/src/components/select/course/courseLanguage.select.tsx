import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useEffect, useMemo } from "react";
import { fetchCourseLanguage } from "../../../redux/reducer/courseLanguageReducer";
export interface CourseLanguageSelectProps {
  onChange?: (value: number) => void;
  value?: number;
}
const CourseLanguageSelect: React.FC<CourseLanguageSelectProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const courseLanguage = useSelector(
    (state: RootState) => state.courseLanguage?.courseLanguage || []
  );
  useEffect(() => {
    if (!courseLanguage.length) {
      dispatch(fetchCourseLanguage());
    }
  }, [courseLanguage]);
  const options = useMemo(
    () => courseLanguage?.map((a) => ({ value: a.languageId, label: a.name })),
    [courseLanguage]
  );

  return (
    <Select
      value={props.value}
      onChange={props.onChange}
      showSearch
      placeholder="Select a language"
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={options}
    />
  );
};

export default CourseLanguageSelect;
