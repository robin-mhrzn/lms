namespace SharedLib
{
    public class SharedEnums
    {
        public enum Role
        {
            Admin = 1,
            User = 2
        }

        public enum PaginationSortBy
        {
            Asc,
            Desc
        }

        public enum WebhookName
        {
            CourseCheck,
            PurchaseCourse,
            CourseList,
            PurchaseCourseDetail,
            PurchaseCourseModuleDetail
        }
    }
}
