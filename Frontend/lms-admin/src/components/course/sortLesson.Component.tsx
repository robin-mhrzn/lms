import { useEffect, useState } from "react";
import { Button, Modal, Space } from "antd";
import { ILessonModule } from "../../services/courseService/courseService";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem: React.FC<{ lesson: ILessonModule }> = ({ lesson }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.lessonId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 mb-2 bg-white shadow-md rounded-md flex justify-between cursor-pointer"
    >
      <span>{lesson.title}</span>
      <span className="text-gray-400">⋮⋮</span>
    </li>
  );
};

export interface SortLessonComponentProps {
  isModalOpen: boolean;
  loader: boolean;
  moduleId: number;
  lessons: ILessonModule[];
  handleCancel?: () => void;
  onSaveSort?: (moduleId: number, lessonIds: number[]) => void;
}

const SortLessonComponent: React.FC<SortLessonComponentProps> = (props) => {
  const [sortedLesson, setSortedLesson] = useState<ILessonModule[]>(
    props.lessons
  );
  useEffect(() => {
    setSortedLesson(props.lessons);
  }, [props.lessons]);
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sortedLesson.findIndex((m) => m.lessonId === active.id);
      const newIndex = sortedLesson.findIndex((m) => m.lessonId === over.id);
      setSortedLesson(arrayMove(sortedLesson, oldIndex, newIndex));
    }
  };

  const handleSaveSort = () => {
    const sortedIds = sortedLesson.map((lesson) => lesson.lessonId);
    if (props.onSaveSort) {
      props.onSaveSort(props.moduleId, sortedIds);
    }
  };

  return (
    <Modal
      title="Sort Lesson"
      open={props.isModalOpen}
      onCancel={props.handleCancel}
      footer={
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-3">
          <Space>
            <Button onClick={props.handleCancel} className="rounded-lg">
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSaveSort}
              className="rounded-lg"
              loading={props.loader}
            >
              Save Order
            </Button>
          </Space>
        </div>
      }
    >
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortedLesson.map((lesson) => lesson.lessonId)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="bg-gray-100 p-4 rounded-lg">
            {sortedLesson.map((lesson) => (
              <SortableItem key={lesson.lessonId} lesson={lesson} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};

export default SortLessonComponent;
