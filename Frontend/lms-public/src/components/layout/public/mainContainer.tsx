interface PageProps {}
interface MainContainerProps {
  children: React.ReactNode;
}
const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <section>
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-10">
        {children}
      </div>
    </section>
  );
};
export default MainContainer;
