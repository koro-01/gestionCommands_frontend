"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function ProductSelectionStep({ formData, handleChange, handleNext, handlePrevious, onCancel, products }) {
  const { t } = useTranslation();

  const selectedProduct = products.find(p => String(p.id) === String(formData.productId));

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  return (
    <form onSubmit={handleSubmit} className="command-form-step">
      <h2>{t("commands.formCommand.productSelection")}</h2>
      <div className="form-group">
        <label>{t("commands.formCommand.product")}</label>
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          required
        >
          <option value="">{t("commands.formCommand.selectProduct")}</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.description ?? p.nom ?? p.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="product-details">
          <h3>{t("commands.formCommand.productDetails")}</h3>
          <p>{t("commands.formCommand.category")}: {selectedProduct.category ?? "-"}</p>
          <p>{t("commands.formCommand.availableStock")}: {selectedProduct.Qtte ?? "-"}</p>
        </div>
      )}

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
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={handlePrevious}>
          {t("common.previous")}
        </button>
        <button type="submit" className="btn-primary">
          {t("common.next")}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {t("commands.formCommand.cancel")}
        </button>
      </div>
    </form>
  );
}
