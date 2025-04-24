interface PageProps {}
interface MainContainerProps {
  children: React.ReactNode;
  title: string;
  content: string;
}
const MainContainer: React.FC<MainContainerProps> = ({
  children,
  title,
  content,
}) => {
  return (
    <section>
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-10">
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{content}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
};
export default MainContainer;
