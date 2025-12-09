"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function LogisticsStatusStep({ formData, handleChange, handlePrevious, onSave, onCancel, livreurs, preparateurs }) {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(e); // Assuming onSave handles the final submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="command-form-step">
      <h2>{t("commands.formCommand.logisticsStatus")}</h2>
      <div className="form-group">
        <label>{t("commands.formCommand.deliveryPerson")}</label>
        <select
          name="livreurId"
          value={formData.livreurId}
          onChange={handleChange}
          required
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
        <label>{t("commands.formCommand.status")}</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">{t("commands.formCommand.pending")}</option>
          <option value="in_progress">{t("commands.formCommand.in_progress")}</option>
          <option value="completed">{t("commands.formCommand.completed")}</option>
          <option value="cancelled">{t("commands.formCommand.cancelled")}</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={handlePrevious}>
          {t("common.previous")}
        </button>
        <button type="submit" className="btn-primary">
          {t("commands.formCommand.save")}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {t("commands.formCommand.cancel")}
        </button>
      </div>
    </form>
  );
}
