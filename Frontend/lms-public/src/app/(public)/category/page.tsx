import {
  CategoryItemModel,
  CourseService,
} from "@/services/courseService/courseService";
import { generateCourseUrl, NavigationRoute } from "@/util/navigation";
import { getImageUrl } from "@/util/sharedHelper";
import Image from "next/image";
import Link from "next/link";

const CategoryList = async () => {
  const courseService = new CourseService();
  const categories = await courseService.getCategories(false);
  if (!categories || categories.length == 0) {
    return (
      <div>
        <h1>Category List</h1>
        <p>No categories found.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20">
        <h1 className="text-2xl font-bold mb-6">Category List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category: CategoryItemModel) => (
            <div
              key={"cat_" + category.categoryId}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-40">
                <Image
                  src={
                    category.imageUrl != null
                      ? getImageUrl(category.imageUrl)
                      : "/images/default-category.png"
                  }
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <Link
                  href={`${generateCourseUrl(category.categoryId)}`}
                  key={category.categoryId}
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    {category.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description || "No description available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
