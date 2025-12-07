"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import StatCard from "../components/cards/StatCard";
import ChartCard from "../components/charts/ChartCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/pages/dashboard.css";

import { BsFillBoxSeamFill } from "react-icons/bs";
import { FaShoppingBag, FaTruck, FaUserCog } from "react-icons/fa";

import useCrud from "../hooks/useCrud";
import commandeApi from "../api/commandeApi";
import produitApi from "../api/produitApi";
import livreurApi from "../api/livreurApi";
import preparateurApi from "../api/preparateurApi";
import AnimatedIcon from "@/components/AnimatedIcon";

export default function Dashboard() {
  const { t } = useTranslation();

  // Fetch data
  const { items: commandes } = useCrud(commandeApi);
  const { items: produits } = useCrud(produitApi);
  const { items: livreurs } = useCrud(livreurApi);
  const { items: preparateurs } = useCrud(preparateurApi);

  // States
  const [stats, setStats] = useState({
    totalCommands: 0,
    totalProducts: 0,
    totalLivreurs: 0,
    totalPreparateurs: 0,
  });
  const [displayed, setDisplayed] = useState(stats);
  const [loading, setLoading] = useState(true);
  const timersRef = useRef({});

  // Charts
  const [commandsByStatus, setCommandsByStatus] = useState([]);
  const [productsPerformance, setProductsPerformance] = useState([]);
  const [revenueByStatus, setRevenueByStatus] = useState([]);
  const [topProductsRevenue, setTopProductsRevenue] = useState([]);
  const [commandTrends, setCommandTrends] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);

  // --- Step 2a: Update stats & charts ---
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
      produits.map((p) => ({ name: p.description ?? "-", value: p.Qtte ?? 0 }))
    );

    // Revenue by status
    const revenueStatus = Object.entries(
      commandes.reduce((acc, cmd) => {
        const status = cmd.status || "Unknown";
        const product = produits.find((p) => p.id === cmd.produit_id);
        const qty = Number(cmd.Qtte ?? 1);
        const price = parseFloat(product?.P_V ?? 0);
        acc[status] = (acc[status] || 0) + qty * price;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));
    setRevenueByStatus(revenueStatus);

    // Top products revenue
    const topRevenue = produits
      .map((p) => {
        const relatedCmds = commandes.filter((c) => c.produit_id === p.id);
        const revenue = relatedCmds.reduce(
          (sum, c) => sum + c.Qtte * (p.P_V ?? 0),
          0
        );
        return { name: p.description ?? "-", value: revenue };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    setTopProductsRevenue(topRevenue);

    // Command trends by day
    const trends = commandes.reduce((acc, cmd) => {
      const date = new Date(cmd.created_at).toISOString().slice(0, 10);
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const trendsArray = Object.entries(trends)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([name, value]) => ({ name, value }));
    setCommandTrends(trendsArray);

    // Revenue by product category
    const categoryRevenue = produits.reduce((acc, p) => {
      const relatedCmds = commandes.filter((c) => c.produit_id === p.id);
      const revenue = relatedCmds.reduce(
        (sum, c) => sum + c.Qtte * (p.P_V ?? 0),
        0
      );
      const category = p.category ?? "Uncategorized";
      acc[category] = (acc[category] || 0) + revenue;
      return acc;
    }, {});
    setRevenueByCategory(
      Object.entries(categoryRevenue).map(([name, value]) => ({ name, value }))
    );

    setLoading(false);
  }, [commandes, produits, livreurs, preparateurs]);

  // --- Step 2b: Animate stats numbers ---
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

  // --- Step 3: Render dashboard ---
  if (loading)
    return (
      <div className="dashboard-loading">
        <div className="stats-grid">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} height={100} />
            ))}
        </div>
        <div className="charts-grid">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} height={300} />
            ))}
        </div>
      </div>
    );

  return (
    <div className="dashboard">
      <h1>{t("dashboard.title")}</h1>

      {/* Stats cards */}
      <div className="stats-grid">
        <StatCard
          title={t("dashboard.totalCommands")}
          value={displayed.totalCommands}
          icon={
            <AnimatedIcon>
              <BsFillBoxSeamFill
                style={{ color: "#6366F1", fontSize: "32px" }}
              />
            </AnimatedIcon>
          }
        />

        <StatCard
          title={t("dashboard.totalProducts")}
          value={displayed.totalProducts}
          icon={
            <AnimatedIcon>
              <FaShoppingBag style={{ color: "#10B981", fontSize: "32px" }} />
            </AnimatedIcon>
          }
        />

        <StatCard
          title={t("dashboard.deliveryPersonnel")}
          value={displayed.totalLivreurs}
          icon={
            <AnimatedIcon>
              <FaTruck style={{ color: "#F97316", fontSize: "32px" }} />
            </AnimatedIcon>
          }
        />

        <StatCard
          title={t("dashboard.preparateurs")}
          value={displayed.totalPreparateurs}
          icon={
            <AnimatedIcon>
              <FaUserCog style={{ color: "#D946EF", fontSize: "32px" }} />
            </AnimatedIcon>
          }
        />
      </div>

      {/* Charts grid */}
      <div className="charts-grid">
        <ChartCard
          title={t("dashboard.commandsByStatus")}
          data={commandsByStatus}
          type="pie"
          dataKey="value"
          colors={["#F59E0B", "#10B981", "#3B82F6", "#D946EF"]}
        />
        <ChartCard
          title={t("dashboard.productsPerformance")}
          data={productsPerformance}
          type="bar"
          dataKey="value"
          colors={["#16A34A"]}
        />
        <ChartCard
          title={t("dashboard.revenueByStatus")}
          data={revenueByStatus}
          type="area"
          dataKey="value"
          colors={["#F97316"]}
        />
        <ChartCard
          title={t("dashboard.topProductsRevenue")}
          data={topProductsRevenue}
          type="composed"
          dataKey="value"
          colors={["#3B82F6", "#6366F1"]}
        />
        <ChartCard
          title={t("dashboard.dailyCommandTrends")}
          data={commandTrends}
          type="line"
          dataKey="value"
          colors={["#10B981"]}
        />
        <ChartCard
          title={t("dashboard.revenueByCategory")}
          data={revenueByCategory}
          type="pie"
          dataKey="value"
          colors={["#F59E0B", "#3B82F6", "#D946EF", "#16A34A"]}
        />
      </div>
    </div>
  );
}
