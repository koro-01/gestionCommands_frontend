import { MdLocalGroceryStore } from "react-icons/md";
import { BsFillBoxSeamFill } from "react-icons/bs";
("use client");

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import StatCard from "../components/cards/StatCard";
import ChartCard from "../components/charts/ChartCard";
import "../styles/pages/dashboard.css";
import { FaBoxOpen, FaShoppingBag, FaTruck, FaUserCog } from "react-icons/fa";
import {
  FaClipboardList,
  FaBoxes,
  FaMotorcycle,
  FaUsersCog,
} from "react-icons/fa";

import useCrud from "../hooks/useCrud";
import commandeApi from "../api/commandeApi";
import produitApi from "../api/produitApi";
import livreurApi from "../api/livreurApi";
import preparateurApi from "../api/preparateurApi";

export default function Dashboard() {
  const { t } = useTranslation();

  const { items: commandes } = useCrud(commandeApi);
  const { items: produits } = useCrud(produitApi);
  const { items: livreurs } = useCrud(livreurApi);
  const { items: preparateurs } = useCrud(preparateurApi);

  const [stats, setStats] = useState({
    totalCommands: 0,
    totalProducts: 0,
    totalLivreurs: 0,
    totalPreparateurs: 0,
  });
  const [displayed, setDisplayed] = useState(stats);
  const [loading, setLoading] = useState(true);
  const timersRef = useRef({});

  const [commandsByStatus, setCommandsByStatus] = useState([]);
  const [productsPerformance, setProductsPerformance] = useState([]);

  // Update stats and chart data
  useEffect(() => {
    if (!commandes || !produits || !livreurs || !preparateurs) return;

    // Stats
    const newStats = {
      totalCommands: commandes.length,
      totalProducts: produits.length,
      totalLivreurs: livreurs.length,
      totalPreparateurs: preparateurs.length,
    };
    setStats(newStats);

    // Commands by status
    const statusCounts = commandes.reduce((acc, cmd) => {
      const status = cmd.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    setCommandsByStatus(
      Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
    );

    // Products performance
    setProductsPerformance(
      produits.map((p) => ({
        name: p.description ?? p.name ?? "-",
        value: p.Qtte ?? 0,
      }))
    );

    setLoading(false);
  }, [commandes, produits, livreurs, preparateurs]);

  // Animate numbers for all stats
  useEffect(() => {
    const keys = [
      "totalCommands",
      "totalProducts",
      "totalLivreurs",
      "totalPreparateurs",
    ];
    keys.forEach((key) => {
      const from = Number(displayed[key] ?? 0);
      const to = Number(stats[key] ?? 0);
      if (from === to) return;

      if (timersRef.current[key]) clearInterval(timersRef.current[key]);

      const diff = Math.abs(to - from);
      const steps = Math.min(60, Math.max(6, Math.floor(diff / 3)));
      const stepValue = Math.max(1, Math.ceil(diff / steps));
      const direction = to > from ? 1 : -1;
      const tick = 30;

      timersRef.current[key] = setInterval(() => {
        setDisplayed((prev) => {
          const cur = Number(prev[key] ?? 0);
          const next = cur + direction * stepValue;
          if (
            (direction === 1 && next >= to) ||
            (direction === -1 && next <= to)
          ) {
            clearInterval(timersRef.current[key]);
            timersRef.current[key] = null;
            return { ...prev, [key]: to };
          }
          return { ...prev, [key]: next };
        });
      }, tick);
    });

    return () => {
      Object.values(timersRef.current || {}).forEach(
        (t) => t && clearInterval(t)
      );
      timersRef.current = {};
    };
  }, [stats]);

  if (loading) return <div className="loading">{t("dashboard.loading")}</div>;

  return (
    <div className="dashboard">
      <h1>{t("dashboard.title")}</h1>

      <div className="stats-grid">
        <StatCard
          title={t("dashboard.totalCommands")}
          value={displayed.totalCommands}
          // Indigo: Professional, trustworthy, deep (Replaces standard Blue)
          icon={<BsFillBoxSeamFill style={{ color: "#6366F1" }} />}
        />
        <StatCard
          title={t("dashboard.totalProducts")}
          value={displayed.totalProducts}
          // Emerald: Clean, crisp, implies assets/growth (Replaces standard Green)
          icon={<FaShoppingBag style={{ color: "#10B981" }} />}
        />
        <StatCard
          title={t("dashboard.deliveryPersonnel")}
          value={displayed.totalLivreurs}
          // Orange: Energetic, implies movement/transit (High visibility)
          icon={<FaTruck style={{ color: "#F97316" }} />}
        />
        <StatCard
          title={t("dashboard.preparateurs")}
          value={displayed.totalPreparateurs}
          // Fuchsia/Pink: Creative, human-centric, modern pop (Replaces deep Purple)
          icon={<FaUserCog style={{ color: "#D946EF" }} />}
        />
      </div>

      <div className="charts-grid">
        <ChartCard
          title={t("dashboard.commandsByStatus")}
          data={commandsByStatus}
          type="pie"
          dataKey="value"
        />
        <ChartCard
          title={t("dashboard.productsPerformance")}
          data={productsPerformance}
          type="bar"
          dataKey="value"
          color="#16A34A"
        />
      </div>
    </div>
  );
}
