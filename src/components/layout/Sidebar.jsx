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

// framer-motion
import { motion } from "framer-motion";

export default function Sidebar({ isOpen }) {
  const { t } = useTranslation();
  const [expandedMenu, setExpandedMenu] = useState("commands");

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      id: "commands",
      icon: FaClipboardList,
      color: "#6366F1",
      title: t("commands.title"),
      items: [{ label: t("commands.formCommand.allCommands"), path: "/commands" }],
    },
    {
      id: "products",
      icon: FaShoppingBag,
      color: "#10B981",
      title: t("dashboard.totalProducts"),
      items: [{ label: t("commands.formCommand.allProducts"), path: "/products" }],
    },
    {
      id: "livreurs",
      icon: FaTruck,
      color: "#F97316",
      title: t("dashboard.deliveryPersonnel"),
      items: [{ label: t("commands.formCommand.allLivreurs"), path: "/livreurs" }],
    },
    {
      id: "preparateurs",
      icon: FaUserCog,
      color: "#D946EF",
      title: t("dashboard.preparateurs"),
      items: [
        { label: t("commands.formCommand.allPreparateurs"), path: "/preparateurs" },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h2 style={{ display: "flex", alignItems: "center" }} className="gap-2.5 whitespace-nowrap">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <BsSpeedometer2 size={25} style={{ marginRight: 10, color: "#2563EB" }} />
          </motion.div>
          {t("dashboard.title")}
        </h2>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className="nav-item gap-2.5 whitespace-nowrap" style={{ display: "flex", alignItems: "center" }}>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <AiOutlineHome size={22} style={{ marginRight: 10, color: "#3B82F6" }} />
          </motion.div>
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
                style={isActive ? { borderLeft: `4px solid ${menu.color}` } : {}}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Icon size={20} style={{ marginRight: 8, color: menu.color }} />
                </motion.div>

                {menu.title}
                <span className="chevron">›</span>
              </button>

              {isActive && (
                <motion.div
                  className="nav-submenu"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {menu.items.map((item, idx) => (
                    <Link key={idx} to={item.path} className="nav-item">
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
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
