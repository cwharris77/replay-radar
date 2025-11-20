"use server";
import { CardNav } from "@/components";
import { getServerAuthData } from "@/lib/serverAuth";
import logo from "public/replay_radar_logo.svg";

const items = [
  {
    label: "Home",
    bgColor: "#022703",
    textColor: "#fff",
    links: [{ label: "Dashboard", ariaLabel: "Your Dashboard", href: "/" }],
  },
  {
    label: "Pages",
    bgColor: "#2C5530",
    textColor: "#fff",
    links: [
      { label: "Artists", ariaLabel: "Artists Page", href: "/artists" },
      { label: "Tracks", ariaLabel: "Tracks Page", href: "/tracks" },
      { label: "Trends", ariaLabel: "Trends Page", href: "/trends" },
    ],
  },
  {
    label: "About",
    bgColor: "#4D7EA8",
    textColor: "#fff",
    links: [{ label: "About Us", ariaLabel: "About Us", href: "/about" }],
  },
];

const TopNav = async () => {
  const { isAuthenticated } = await getServerAuthData();

  const buttonBgColor = !isAuthenticated
    ? "var(--color-primary)"
    : "var(--auburn)";

  return (
    <div className='flex justify-center mt-[1.2em] md:mt-[2em]'>
      <CardNav
        logo={logo.src}
        logoAlt='Replay Radar Logo'
        items={items}
        baseColor='var(--color-secondary)'
        menuColor='var(--color-primary)'
        buttonBgColor={buttonBgColor}
        buttonTextColor='#fff'
        ease='power3.out'
        className=''
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default TopNav;
