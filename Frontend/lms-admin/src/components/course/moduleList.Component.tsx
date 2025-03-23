import { MoreOutlined } from "@ant-design/icons";
import { Card, List } from "antd";

const ModuleCard = () => {
  const courses = [
    {
      name: "React for Beginners",
      description: "Learn the basics of React.js from scratch.",
      lessons: 10,
      slides: 5,
      duration: "20 Minutes",
      tests: 2,
      image: "https://via.placeholder.com/50",
    },
    {
      name: "Advanced JavaScript",
      description: "Deep dive into JavaScript concepts and best practices.",
      lessons: 15,
      slides: 8,
      duration: "35 Minutes",
      tests: 3,
      image: "https://via.placeholder.com/50",
    },
    {
      name: "Full-Stack Development",
      description: "Build full-stack applications using modern technologies.",
      lessons: 20,
      slides: 12,
      duration: "45 Minutes",
      tests: 5,
      image: "https://via.placeholder.com/50",
    },
  ];
  return (
    <Card
      title="Course List"
      className="shadow-lg rounded-2xl p-6 mt-6"
      bordered={false}
    >
      <List
        itemLayout="horizontal"
        dataSource={courses}
        renderItem={(course) => (
          <List.Item>
            <List.Item.Meta
              title={
                <span className="font-semibold">
                  {course.name} <span className="text-blue-500">✔</span>
                </span>
              }
              description={
                <>
                  <p>{course.description}</p>
                  <p className="text-gray-500">
                    {course.slides} Slides • {course.duration}
                  </p>
                  <p className="text-gray-500">{course.tests} Tests</p>
                </>
              }
            />
            <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
          </List.Item>
        )}
      />
    </Card>
  );
};
export default ModuleCard;
