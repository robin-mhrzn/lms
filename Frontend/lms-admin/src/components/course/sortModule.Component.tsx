import { useEffect, useState } from "react";
import { Button, Modal, Space } from "antd";
import { IModuleListModel } from "../../services/courseService/courseService";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem: React.FC<{ module: IModuleListModel }> = ({ module }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module.moduleId });

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
      <span>{module.name}</span>
      <span className="text-gray-400">⋮⋮</span>
    </li>
  );
};

export interface SortModuleComponentProps {
  isModalOpen: boolean;
  loader: boolean;
  modules: IModuleListModel[];
  handleCancel?: () => void;
  onSaveSort?: (sortedIds: number[]) => void;
}

const SortModuleComponent: React.FC<SortModuleComponentProps> = (props) => {
  const [sortedModules, setSortedModules] = useState<IModuleListModel[]>(
    props.modules
  );
  useEffect(() => {
    setSortedModules(props.modules);
  }, [props.modules]);
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sortedModules.findIndex((m) => m.moduleId === active.id);
      const newIndex = sortedModules.findIndex((m) => m.moduleId === over.id);
      setSortedModules(arrayMove(sortedModules, oldIndex, newIndex));
    }
  };

  const handleSaveSort = () => {
    const sortedIds = sortedModules.map((module) => module.moduleId);
    if (props.onSaveSort) props.onSaveSort(sortedIds);
  };

  return (
    <Modal
      title="Sort Modules"
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
          items={sortedModules.map((module) => module.moduleId)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="bg-gray-100 p-4 rounded-lg">
            {sortedModules.map((module) => (
              <SortableItem key={module.moduleId} module={module} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};

export default SortModuleComponent;
