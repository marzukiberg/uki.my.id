import Image from "next/image";
import AppsMenuButton from "../ui/apps-menu-button";

const Navbar = ({ router }) => {
  return (
    <nav className="absolute right-0 top-0 flex items-center space-x-4 p-4">
      <AppsMenuButton />
      <button
        onClick={() => router.push("/about")}
        className="rounded-full p-1 hover:bg-gray-100"
      >
        <Image
          src="/img/profile.jpeg"
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      </button>
    </nav>
  );
};

export default Navbar;
