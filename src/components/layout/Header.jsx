import { MdOutlineWbSunny, MdOutlineDarkMode } from "react-icons/md";
import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";

import "../../styles/components/header.css";

import Usa from "../../assets/images/usa.png";
import Fr from "../../assets/images/fr.png";
import Ar from "../../assets/images/ar.png";

const languages = [
  { name: "Français", image: Fr, code: "fr" },
  { name: "العربية", image: Ar, code: "ar" },
  { name: "English", image: Usa, code: "en" },
];

export default function Header({ onMenuClick, darkMode, onThemeToggle }) {
  const { i18n } = useTranslation();

  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("i18nextLng");
    return languages.find((l) => l.code === saved) || languages[0];
  });

  useEffect(() => {
    i18n.changeLanguage(selected.code);
    localStorage.setItem("i18nextLng", selected.code);
  }, [selected, i18n]);

  const isRTL = selected.code === "ar";

  return (
    <header className={`app-header ${isRTL ? "rtl" : ""}`}>
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick}>
          ☰
        </button>
        <h1 className="header-title">{i18n.t("header.title")}</h1>
      </div>

      <div className="header-right">
        {/* Language Picker */}
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative">
            <Listbox.Button className="lang-button">
              <img
                src={selected.image}
                alt={selected.name}
                className="lang-flag"
              />
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="lang-menu">
                {languages.map((lang, i) => (
                  <Listbox.Option key={i} value={lang} as={Fragment}>
                    {({ active }) => (
                      <li className={`lang-option ${active ? "active" : ""}`}>
                        <img src={lang.image} className="lang-option-flag" />
                        {lang.name}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          title={`Switch to ${darkMode ? "light" : "dark"} mode`}
          className="theme-toggle"
        >
          {darkMode ? (
            <MdOutlineWbSunny
              className="theme-icon sun-animate"
              size={24}
              style={{ color: "#F59E0B" }}
            />
          ) : (
            <MdOutlineDarkMode
              className="theme-icon moon-animate"
              size={24}
              style={{ color: "#6366F1" }}
            />
          )}
        </button>
      </div>
    </header>
  );
}
