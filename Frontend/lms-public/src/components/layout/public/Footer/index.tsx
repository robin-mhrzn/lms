import Link from "next/link";
import Image from "next/image";
import Logo from "../Header/Logo";
import { headerData } from "../Header/Navigation/menuData";
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Folder,
} from "lucide-react";
import { getCurrentYear } from "@/util/sharedHelper";

const footer = () => {
  const currentYear = getCurrentYear();
  return (
    <footer className=" bg-deepSlate py-10">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8">
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <Logo />
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="https://facebook.com"
                className="hover:text-primary text-black text-3xl"
              >
                <Facebook />
              </Link>
              <Link
                href="https://twitter.com"
                className="hover:text-primary text-black text-3xl"
              >
                <Twitter />
              </Link>
              <Link
                href="https://instagram.com"
                className="hover:text-primary text-black text-3xl"
              >
                <Instagram />
              </Link>
            </div>
          </div>
          <div className="col-span-2">
            <h3 className="mb-4 text-2xl font-medium">Links</h3>
            <ul>
              {headerData.map((item, index) => (
                <li
                  key={index}
                  className="mb-2 text-black/50 hover:text-primary w-fit"
                >
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2">
            <h3 className="mb-4 text-2xl font-medium">Other</h3>
            <ul>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">About Us</Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">Our Team</Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">career</Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">Services</Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-4 md:col-span-4 lg:col-span-4">
            <div className="flex items-center gap-2">
              <MapPin></MapPin>
              <h5 className="text-lg text-black/60">
                925 Filbert Street Pennsylvania 18072
              </h5>
            </div>
            <div className="flex gap-2 mt-10">
              <Phone></Phone>
              <h5 className="text-lg text-black/60">+45 3411-4411</h5>
            </div>
            <div className="flex gap-2 mt-10">
              <Folder></Folder>
              <h5 className="text-lg text-black/60">info@gmail.com</h5>
            </div>
          </div>
        </div>

        <div className="mt-10 lg:flex items-center justify-between">
          <h4 className="text-black/50 text-sm text-center lg:text-start font-normal">
            @{currentYear} All Rights Reserved
          </h4>
          <div className="flex gap-5 mt-5 lg:mt-0 justify-center lg:justify-start">
            <Link
              href="/"
              target="_blank"
              className="text-black/50 text-sm font-normal hover:text-primary"
            >
              Privacy policy
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-black/50 text-sm font-normal hover:text-primary"
            >
              Terms & conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default footer;
