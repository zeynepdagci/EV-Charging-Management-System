"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import Cookies from "js-cookie";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "",
    menuItems: [
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="
      M12 2
      C8.69 2 6 4.69 6 8
      C6 12.53 12 20 12 20
      C12 20 18 12.53 18 8
      C18 4.69 15.31 2 12 2
      Z
      M12 10.5
      C10.62 10.5 9.5 9.38 9.5 8
      C9.5 6.62 10.62 5.5 12 5.5
      C13.38 5.5 14.5 6.62 14.5 8
      C14.5 9.38 13.38 10.5 12 10.5
      Z
    "
            />
          </svg>
        ),
        label: "Find Charging Stations",
        route: "/dashboard",
      },
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="
    M19.14 12.94
    c.04-.31.06-.63.06-.94
    s-.02-.63-.06-.94
    l2.03-1.58
    c.19-.15.24-.41.12-.63
    l-1.92-3.32
    c-.12-.22-.38-.3-.62-.21
    l-2.39.96
    a7.14 7.14 0 0 0-1.7-.99
    l-.36-2.54
    A.5.5 0 0 0 14.4 2
    h-4.8
    a.5.5 0 0 0-.49.42
    l-.36 2.54
    c-.62.26-1.19.6-1.7.99
    l-2.39-.96
    c-.23-.09-.5 0-.62.21
    L2.71 8.85
    c-.12.22-.07.48.12.63
    l2.03 1.58
    c-.04.31-.06.63-.06.94
    s.02.63.06.94
    l-2.03 1.58
    c-.19.15-.24.41-.12.63
    l1.92 3.32
    c.12.22.38.3.62.21
    l2.39-.96
    c.51.38 1.08.72 1.7.99
    l.36 2.54
    c.03.24.24.42.49.42
    h4.8
    c.25 0 .46-.18.49-.42
    l.36-2.54
    c.62-.27 1.18-.61 1.7-.99
    l2.39.96
    c.24.09.5 0 .62-.21
    l1.92-3.32
    c.12-.22.07-.48-.12-.63
    l-2.03-1.58
    Z
    M12 15.5
    a3.5 3.5 0 1 1 0-7
    a3.5 3.5 0 0 1 0 7
    Z
  "
            />
          </svg>
        ),
        label: "Manage Charging Stations",
        route: "/manage-charging-stations",
      },
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 4H18V2C18 1.45 17.55 1 17 1C16.45 1 16 1.45 16 2V4H8V2C8 1.45 7.55 1 7 1C6.45 1 6 1.45 6 2V4H5C3.34 4 2 5.34 2 7V19C2 20.66 3.34 22 5 22H19C20.66 22 22 20.66 22 19V7C22 5.34 20.66 4 19 4ZM20 19C20 19.55 19.55 20 19 20H5C4.45 20 4 19.55 4 19V10H20V19Z" />

            <path d="M13 14H15L11 22V16H9L13 8V14Z" />
          </svg>
        ),
        label: "Reservations",
        route: "/reservations",
      },
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.11 2.9 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.9 21.11 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />

            <path d="M15.5 3.5H17L14.5 8V5.5H13L15.5 3.5Z" />
          </svg>
        ),
        label: "Contact Us",
        route: "#",
        children: [
          // { label: "Form Elements", route: "/forms/form-elements" },
          { label: "Contact Form", route: "/forms/form-layout" },
        ],
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.2892 4.88976C17.2615 4.75159 15.9068 4.75 14 4.75L10 4.75C8.09318 4.75 6.73851 4.75159 5.71085 4.88976C4.70476 5.02503 4.12511 5.27869 3.7019 5.7019C3.27869 6.12511 3.02502 6.70476 2.88976 7.71085C2.75159 8.73851 2.75 10.0932 2.75 12C2.75 13.9068 2.75159 15.2615 2.88976 16.2892C3.02502 17.2952 3.27869 17.8749 3.7019 18.2981C4.12511 18.7213 4.70476 18.975 5.71085 19.1102C6.73851 19.2484 8.09318 19.25 10 19.25H14C15.9068 19.25 17.2615 19.2484 18.2892 19.1102C19.2952 18.975 19.8749 18.7213 20.2981 18.2981C20.7213 17.8749 20.975 17.2952 21.1102 16.2892C21.2484 15.2615 21.25 13.9068 21.25 12C21.25 10.0932 21.2484 8.73851 21.1102 7.71085C20.975 6.70476 20.7213 6.12511 20.2981 5.7019C19.8749 5.27869 19.2952 5.02502 18.2892 4.88976ZM18.489 3.40314C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.1071 5.38961 22.4392 6.33856 22.5969 7.51098C22.75 8.65019 22.75 10.1058 22.75 11.9436V12.0564C22.75 13.8942 22.75 15.3498 22.5969 16.489C22.4392 17.6614 22.1071 18.6104 21.3588 19.3588C20.6104 20.1071 19.6614 20.4392 18.489 20.5969C17.3498 20.75 15.8942 20.75 14.0564 20.75H9.94359C8.10583 20.75 6.65019 20.75 5.51098 20.5969C4.33856 20.4392 3.38961 20.1071 2.64124 19.3588C1.89288 18.6104 1.56076 17.6614 1.40314 16.489C1.24997 15.3498 1.24998 13.8942 1.25 12.0564V11.9436C1.24998 10.1058 1.24997 8.65019 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40314C6.65019 3.24997 8.10583 3.24998 9.94359 3.25L14.0564 3.25C15.8942 3.24998 17.3498 3.24997 18.489 3.40314ZM8.25 17C8.25 16.5858 8.58579 16.25 9 16.25H15C15.4142 16.25 15.75 16.5858 15.75 17C15.75 17.4142 15.4142 17.75 15 17.75H9C8.58579 17.75 8.25 17.4142 8.25 17Z"
              fill=""
            />
          </svg>
        ),
        label: "Tables",
        route: "#",
        children: [{ label: "Tables", route: "/tables" }],
      },
      // {
      //   icon: (
      //     <svg
      //       className="fill-current"
      //       width="24"
      //       height="24"
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       xmlns="http://www.w3.org/2000/svg"
      //     >
      //       <path
      //         fillRule="evenodd"
      //         clipRule="evenodd"
      //         d="M2.25 7C2.25 6.58579 2.58579 6.25 3 6.25H13C13.4142 6.25 13.75 6.58579 13.75 7C13.75 7.41421 13.4142 7.75 13 7.75H3C2.58579 7.75 2.25 7.41421 2.25 7ZM16.5 6.25C16.7951 6.25 17.0628 6.42309 17.1839 6.69223L21.6839 16.6922C21.8539 17.07 21.6855 17.514 21.3078 17.6839C20.93 17.8539 20.486 17.6855 20.3161 17.3078L18.8787 14.1136H14.1213L12.6839 17.3078C12.514 17.6855 12.07 17.8539 11.6922 17.6839C11.3145 17.514 11.1461 17.07 11.3161 16.6922L15.8161 6.69223C15.9372 6.42309 16.2049 6.25 16.5 6.25ZM14.7963 12.6136H18.2037L16.5 8.82764L14.7963 12.6136ZM2.25 12C2.25 11.5858 2.58579 11.25 3 11.25H10C10.4142 11.25 10.75 11.5858 10.75 12C10.75 12.4142 10.4142 12.75 10 12.75H3C2.58579 12.75 2.25 12.4142 2.25 12ZM2.25 17C2.25 16.5858 2.58579 16.25 3 16.25H8C8.41421 16.25 8.75 16.5858 8.75 17C8.75 17.4142 8.41421 17.75 8 17.75H3C2.58579 17.75 2.25 17.4142 2.25 17Z"
      //         fill=""
      //       />
      //     </svg>
      //   ),
      //   label: "Pages",
      //   route: "#",
      //   children: [
      //     { label: "Settings", route: "/pages/settings" },
      //   ],
      // },
    ],
  },
  // {
  //   name: "OTHERS",
  //   menuItems: [
  //     {
  //       icon: (
  //         <svg
  //           className="fill-current"
  //           width="24"
  //           height="24"
  //           viewBox="0 0 24 24"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             fillRule="evenodd"
  //             clipRule="evenodd"
  //             d="M14.2544 1.36453C13.1584 1.05859 12.132 1.38932 11.4026 2.05955C10.6845 2.71939 10.25 3.70552 10.25 4.76063V11.4551C10.25 12.7226 11.2775 13.75 12.5449 13.75H19.2394C20.2945 13.75 21.2806 13.3156 21.9405 12.5974C22.6107 11.868 22.9414 10.8416 22.6355 9.74563C21.5034 5.69003 18.31 2.49663 14.2544 1.36453ZM11.75 4.76063C11.75 4.10931 12.0201 3.52918 12.4175 3.16407C12.8035 2.80935 13.3035 2.65643 13.8511 2.8093C17.4013 3.80031 20.1997 6.59875 21.1907 10.1489C21.3436 10.6965 21.1907 11.1965 20.8359 11.5825C20.4708 11.9799 19.8907 12.25 19.2394 12.25H12.5449C12.1059 12.25 11.75 11.8941 11.75 11.4551V4.76063Z"
  //             fill=""
  //           />
  //           <path
  //             d="M8.67232 4.71555C9.0675 4.59143 9.28724 4.17045 9.16312 3.77527C9.039 3.38009 8.61803 3.16036 8.22285 3.28447C4.18231 4.55353 1.25 8.32793 1.25 12.7892C1.25 18.2904 5.70962 22.75 11.2108 22.75C15.6721 22.75 19.4465 19.8177 20.7155 15.7772C20.8397 15.382 20.6199 14.961 20.2247 14.8369C19.8296 14.7128 19.4086 14.9325 19.2845 15.3277C18.2061 18.761 14.9982 21.25 11.2108 21.25C6.53805 21.25 2.75 17.462 2.75 12.7892C2.75 9.00185 5.23899 5.79389 8.67232 4.71555Z"
  //             fill=""
  //           />
  //         </svg>
  //       ),
  //       label: "Charts",
  //       route: "#",
  //       children: [
  //         { label: "Basic Chart", route: "/charts/basic-chart" },
  //       ],
  //     },
  //     {
  //       icon: (
  //         <svg
  //           className="fill-current"
  //           width="24"
  //           height="24"
  //           viewBox="0 0 24 24"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             fillRule="evenodd"
  //             clipRule="evenodd"
  //             d="M6.5 1.75C3.87665 1.75 1.75 3.87665 1.75 6.5C1.75 9.12335 3.87665 11.25 6.5 11.25C9.12335 11.25 11.25 9.12335 11.25 6.5C11.25 3.87665 9.12335 1.75 6.5 1.75ZM3.25 6.5C3.25 4.70507 4.70507 3.25 6.5 3.25C8.29493 3.25 9.75 4.70507 9.75 6.5C9.75 8.29493 8.29493 9.75 6.5 9.75C4.70507 9.75 3.25 8.29493 3.25 6.5Z"
  //             fill=""
  //           />
  //           <path
  //             fillRule="evenodd"
  //             clipRule="evenodd"
  //             d="M17.5 12.75C14.8766 12.75 12.75 14.8766 12.75 17.5C12.75 20.1234 14.8766 22.25 17.5 22.25C20.1234 22.25 22.25 20.1234 22.25 17.5C22.25 14.8766 20.1234 12.75 17.5 12.75ZM14.25 17.5C14.25 15.7051 15.7051 14.25 17.5 14.25C19.2949 14.25 20.75 15.7051 20.75 17.5C20.75 19.2949 19.2949 20.75 17.5 20.75C15.7051 20.75 14.25 19.2949 14.25 17.5Z"
  //             fill=""
  //           />
  //           <path
  //             fillRule="evenodd"
  //             clipRule="evenodd"
  //             d="M12.75 6.5C12.75 3.87665 14.8766 1.75 17.5 1.75C20.1234 1.75 22.25 3.87665 22.25 6.5C22.25 9.12335 20.1234 11.25 17.5 11.25C14.8766 11.25 12.75 9.12335 12.75 6.5ZM17.5 3.25C15.7051 3.25 14.25 4.70507 14.25 6.5C14.25 8.29493 15.7051 9.75 17.5 9.75C19.2949 9.75 20.75 8.29493 20.75 6.5C20.75 4.70507 19.2949 3.25 17.5 3.25Z"
  //             fill=""
  //           />
  //           <path
  //             fillRule="evenodd"
  //             clipRule="evenodd"
  //             d="M6.5 12.75C3.87665 12.75 1.75 14.8766 1.75 17.5C1.75 20.1234 3.87665 22.25 6.5 22.25C9.12335 22.25 11.25 20.1234 11.25 17.5C11.25 14.8766 9.12335 12.75 6.5 12.75ZM3.25 17.5C3.25 15.7051 4.70507 14.25 6.5 14.25C8.29493 14.25 9.75 15.7051 9.75 17.5C9.75 19.2949 8.29493 20.75 6.5 20.75C4.70507 20.75 3.25 19.2949 3.25 17.5Z"
  //             fill=""
  //           />
  //         </svg>
  //       ),
  //       label: "UI Elements",
  //       route: "#",
  //       children: [
  //         { label: "Alerts", route: "/ui-elements/alerts" },
  //         { label: "Buttons", route: "/ui-elements/buttons" },
  //       ],
  //     },
  //   ],
  // },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRoleAuthenticated] = useState(false);

  useEffect(() => {
    if (Cookies.get("accessToken") !== undefined) {
      setIsAuthenticated(true);
    }

    const role = localStorage.getItem("role");
    console.log("Role:", role);
    if (role == "seller") {
      setUserRoleAuthenticated(true);
    }
  }, []);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      {isAuthenticated && (
        <aside
          className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
            sidebarOpen
              ? "translate-x-0 duration-300 ease-linear"
              : "-translate-x-full"
          }`}
        >
          {/* <!-- SIDEBAR HEADER --> */}
          <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
            <Link href="/">
              <Image
                width={176}
                height={32}
                src={"/images/logo/logo-dark.svg"}
                alt="Logo"
                priority
                className="dark:invert"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="block lg:hidden"
            >
              <svg
                className="fill-current"
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
          {/* <!-- SIDEBAR HEADER --> */}

          <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
            {/* <!-- Sidebar Menu --> */}
            <nav className="mt-1 px-4 lg:px-6">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                    {group.name}
                  </h3>
                  <ul className="mb-6 flex flex-col gap-2">
                    {group.menuItems
                      .filter(
                        (menuItem, menuIndex) =>
                          !(menuIndex === 1 && !userRole),
                      )
                      .map((menuItem, menuIndex) => (
                        <SidebarItem
                          key={menuIndex}
                          item={menuItem}
                          pageName={pageName}
                          setPageName={setPageName}
                        />
                      ))}
                  </ul>
                </div>
              ))}
            </nav>
            {/* <!-- Sidebar Menu --> */}
          </div>
        </aside>
      )}
    </ClickOutside>
  );
};

export default Sidebar;
