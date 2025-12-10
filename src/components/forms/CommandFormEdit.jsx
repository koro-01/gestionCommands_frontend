"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/command-form.css";

import produitApi from "../../api/produitApi";
import livreurApi from "../../api/livreurApi";
import preparateurApi from "../../api/preparateurApi";

import { FaSave, FaTimes } from "react-icons/fa";

export default function CommandForm({ command, onSave, onCancel }) {
  const { t } = useTranslation();

  const initIdRef = useRef(null);

  const [formData, setFormData] = useState({
    nom: "",
    phone: "",
    destination: "",
    productId: "",
    livreurId: "",
    preparateurId: "",
    status: "pending",
    quantity: 1,
  });

  const [products, setProducts] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [preparateurs, setPreparateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (command && initIdRef.current !== command.id) {
      setFormData({
        nom: command.nom ?? "",
        phone: command.phone ?? "",
        destination: command.destination ?? "",
        productId: command.produit_id ?? command.product?.id ?? "",
        livreurId: command.livreur_id ?? command.livreur?.id ?? "",
        preparateurId: command.preparateur_id ?? command.preparateur?.id ?? "",
        status: command.status || "pending",
        quantity: Number(command.Qtte ?? command.quantity ?? command.product?.Qtte ?? 1),
      });
      initIdRef.current = command.id;
    }
    fetchFormOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command?.id]);

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
    } catch (error) {
      console.error("Failed to fetch form options:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value || "0", 10) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.livreurId || !formData.preparateurId) {
      alert(t("commands.formCommand.selectProduct"));
      return;
    }

    const payload = {
      nom: formData.nom || null,
      phone: formData.phone || null,
      destination: formData.destination || null,
      produit_id: Number(formData.productId),
      livreur_id: Number(formData.livreurId),
      preparateur_id: Number(formData.preparateurId),
      status: formData.status,
      Qtte: Number(formData.quantity),
    };

    onSave(payload);
  };

  return (
    <form className="command-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t("commands.formCommand.nom")}</label>
        <input
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder={t("commands.formCommand.nom")}
        />
      </div>

      <div className="form-group">
        <label>{t("commands.formCommand.phone")}</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t("commands.formCommand.phone")}
        />
      </div>

      <div className="form-group">
        <label>{t("commands.formCommand.destination")}</label>
        <input
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder={t("commands.formCommand.destination")}
        />
      </div>

      <div className="form-group">
        <label>{t("commands.formCommand.product")}</label>
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">{t("commands.formCommand.selectProduct")}</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.description ?? p.nom ?? p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>{t("commands.formCommand.deliveryPerson")}</label>
        <select
          name="livreurId"
          value={formData.livreurId}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">{t("commands.formCommand.selectLivreur")}</option>
          {livreurs.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nom ?? l.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>{t("commands.formCommand.preparateur")}</label>
        <select
          name="preparateurId"
          value={formData.preparateurId}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">{t("commands.formCommand.selectPreparateur")}</option>
          {preparateurs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom ?? p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>{t("commands.formCommand.quantity")}</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label>{t("commands.formCommand.status")}</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">{t("commands.formCommand.pending")}</option>
          <option value="in_progress">{t("commands.formCommand.in_progress")}</option>
          <option value="completed">{t("commands.formCommand.completed")}</option>
          <option value="cancelled">{t("commands.formCommand.cancelled")}</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          <FaSave style={{ marginRight: 8 }} /> {loading ? t("commands.formCommand.loading") : t("commands.formCommand.save")}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          <FaTimes style={{ marginRight: 8 }} /> {t("commands.formCommand.cancel")}
        </button>
      </div>
    </form>
  );
}