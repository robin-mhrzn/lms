import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        alt="logo"
        width={160}
        height={50}
        style={{ maxWidth: "150px", height: "auto" }}
      />
    </Link>
  );
};

export default Logo;
