"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/components/sidebar.css";
import { useTranslation } from "react-i18next";

// react-icons
import { AiOutlineHome } from "react-icons/ai";
import {
  FaClipboardList,
  FaShoppingBag,
  FaTruck,
  FaUserCog,
  FaChartPie,
} from "react-icons/fa";
import { BsSpeedometer2 } from "react-icons/bs";

export default function Sidebar({ isOpen }) {
  const { t } = useTranslation();
  const [expandedMenu, setExpandedMenu] = useState("commands");

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  // I added a 'color' property to each item to match your Dashboard Cards
  const menuItems = [
    {
      id: "commands",
      icon: FaClipboardList,
      color: "#6366F1", // Indigo (Matches "Total Commands")
      title: t("commands.title"),
      items: [
        {
          label: t("commands.formCommand.allCommands") || t("commands.title"),
          path: "/commands",
        },
      ],
    },
    {
      id: "products",
      icon: FaShoppingBag,
      color: "#10B981", // Emerald (Matches "Total Products")
      title: t("dashboard.totalProducts"),
      items: [
        {
          label: t("commands.formCommand.allProducts") || "All Products",
          path: "/products",
        },
      ],
    },
    {
      id: "livreurs",
      icon: FaTruck,
      color: "#F97316", // Orange (Matches "Delivery")
      title: t("dashboard.deliveryPersonnel"),
      items: [
        {
          label: t("commands.formCommand.allLivreurs") || "All Livreurs",
          path: "/livreurs",
        },
      ],
    },
    {
      id: "preparateurs",
      icon: FaUserCog,
      color: "#D946EF", // Fuchsia (Matches "Preparateurs")
      title: t("dashboard.preparateurs"),
      items: [
        {
          label:
            t("commands.formCommand.allPreparateurs") || "All Preparateurs",
          path: "/preparateurs",
        },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // A dark slate color for the main title is usually cleaner than black
            color: "#1E293B", 
          }}
        >
          {/* Replaced FcLineChart with a cleaner icon styled with a Brand Gradient or primary color */}
          <BsSpeedometer2
            size={25} 
            style={{ 
                marginRight: "10px", 
                color: "#2563EB" // Primary Brand Blue
            }} 
          />
          {t("dashboard.title")}
        </h2>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className="nav-item"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Home Icon: A neutral Sky Blue or Slate looks professional */}
          <AiOutlineHome style={{ marginRight: "10px", color: "#3B82F6" }} />
          {t("dashboard.title")}
        </Link>

        {menuItems.map((menu) => {
          const Icon = menu.icon;
          const isActive = expandedMenu === menu.id;

          return (
            <div key={menu.id} className="nav-menu">
              <button
                className={`nav-menu-title ${isActive ? "active" : ""}`}
                onClick={() => toggleMenu(menu.id)}
                // Optional: Add a subtle border-left using the color when active
                style={isActive ? { borderLeft: `4px solid ${menu.color}` } : {}}
              >
                <Icon 
                    className="menu-icon" 
                    // Apply the specific color defined in menuItems
                    style={{ marginRight: 8, color: menu.color }} 
                />
                {menu.title}
                <span className="chevron">›</span>
              </button>
              {isActive && (
                <div className="nav-submenu">
                  {menu.items.map((item, idx) => (
                    <Link key={idx} to={item.path} className="nav-item">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p>{t("commands.title")}</p>
      </div>
    </aside>
  );
}