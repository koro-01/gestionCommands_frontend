"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MultiStepCommandForm from "../components/forms/MultiStepCommandForm";
import commandeApi from "../api/commandeApi";
import produitApi from "../api/produitApi";
import livreurApi from "../api/livreurApi";
import preparateurApi from "../api/preparateurApi";

export default function NewCommandPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [preparateurs, setPreparateurs] = useState([]);
  const [error, setError] = useState(null);

  const fetchFormOptions = async () => {
    try {
      setLoading(true);

      const [pRes, lRes, prRes] = await Promise.all([
        produitApi.getAll(),
        livreurApi.getAll(),
        preparateurApi.getAll(),
      ]);

      setProducts(pRes?.data ?? pRes ?? []);
      setLivreurs(lRes?.data ?? lRes ?? []);
      setPreparateurs(prRes?.data ?? prRes ?? []);
    } catch (err) {
      console.error("Failed to fetch form options:", err);
      setError(t("commands.errorLoadingRelated"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormOptions();
  }, []);

  const handleSave = async (formData) => {
    try {
      const response = await commandeApi.create(formData);

      if (response?.data?.message === "Not enough stock") {
        alert(`⚠ ${response.data.message}. Available stock: ${response.data.stock}`);
        return;
      }

      alert(t("modal.createTitle"));
      navigate("/commands");
    } catch (err) {
      console.error("Failed to save command:", err);

      if (err.response?.data?.message === "Not enough stock") {
        alert(`⚠ ${err.response.data.message}. Available stock: ${err.response.data.stock}`);
      } else {
        alert(t("commands.saveError", "Failed to save command"));
      }
    }
  };

  if (loading) {
    return <div className="loading">{t("commands.loading", "Loading form...")}</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  return (
    <div className="new-command-page">
      <h1>{t("commands.newCommandTitle", "Create New Command")}</h1>

      <MultiStepCommandForm
        onSave={handleSave}
        onCancel={() => navigate("/commands")}
        products={products}
        livreurs={livreurs}
        preparateurs={preparateurs}
      />
    </div>
  );
}
