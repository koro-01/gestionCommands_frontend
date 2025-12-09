"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function ClientInfoStep({ formData, handleChange, handleNext, onCancel }) {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  return (
    <form onSubmit={handleSubmit} className="command-form-step">
      <h2>{t("commands.formCommand.clientInfo")}</h2>
      <div className="form-group">
        <label>{t("commands.formCommand.nom")}</label>
        <input
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder={t("commands.formCommand.nom")}
          required
        />
      </div>
      <div className="form-group">
        <label>{t("commands.formCommand.phone")}</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t("commands.formCommand.phone")}
          required
        />
      </div>
      <div className="form-group">
        <label>{t("commands.formCommand.destination")}</label>
        <input
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder={t("commands.formCommand.destination")}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {t("commands.next")}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {t("commands.formCommand.cancel")}
        </button>
      </div>
    </form>
  );
}
