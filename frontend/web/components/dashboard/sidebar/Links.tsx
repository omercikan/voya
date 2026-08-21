import useAuth from "@/hooks/useAuth";
import { setActiveLink } from "@/store/slices/linkSlice";
import { AppDispatch, RootState } from "@/store/store";
import { UserRole } from "@/types/user";
import Link from "next/link";
import { IconType } from "react-icons";
import { useDispatch, useSelector } from "react-redux";

interface LinksProps {
  links: {
    label: string;
    href: string;
    icon: IconType;
    role?: UserRole | "ALL";
  }[];
}

const Links = ({ links }: LinksProps) => {
  const dispacth = useDispatch<AppDispatch>();
  const { activeLink } = useSelector((state: RootState) => state.linkSlice);
  const { user } = useAuth();

  return (
    <div>
      {links.map(
        (link) =>
          (user?.role === link.role || link.role === "ALL") && (
            <Link
              onClick={() => dispacth(setActiveLink(link.href))}
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 mt-1 text-sm font-medium transition-colors ${activeLink === link.href ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"} text-sidebar-accent-foreground`}
            >
              <link.icon />
              {link.label}
            </Link>
          ),
      )}
    </div>
  );
};

export default Links;
