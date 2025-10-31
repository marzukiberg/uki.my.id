import Image from "next/image";
import AppsMenuButton from "../ui/apps-menu-button";

const Navbar = ({ router }) => {
    return (
        <nav className="absolute top-0 right-0 p-4 flex items-center space-x-4">
            <AppsMenuButton />
            <button onClick={() => router.push('/about')} className="p-1 rounded-full hover:bg-gray-100">
                <Image src="/img/profile.jpeg" alt="Profile" width={32} height={32} className="rounded-full object-cover" />
            </button>
        </nav>
    );
};

export default Navbar;