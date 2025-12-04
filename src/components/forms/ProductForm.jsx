"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { FaSave, FaTimes } from "react-icons/fa"

export default function ProductForm({ product, onSave, onCancel }) {
  const { t } = useTranslation()
  const initIdRef = useRef(null)

  const [formData, setFormData] = useState({
    description: "",
    category: "",
    Qtte: 0,
    P_A: 0,
    P_V: 0,
  })

  useEffect(() => {
    if (product && initIdRef.current !== product.id) {
      setFormData({
        description: product.description ?? product.name ?? "",
        category: product.category ?? "",
        Qtte: Number(product.Qtte ?? 0),
        P_A: Number(product.P_A ?? 0),
        P_V: Number(product.P_V ?? 0),
      })
      initIdRef.current = product.id
    }
  }, [product?.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["Qtte", "P_A", "P_V"].includes(name) ? Number(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description || !formData.category) {
      alert(t("products.saveFailed")) // using translation for alert
      return
    }
    onSave(formData)
  }

  return (
    <form className="command-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t("products.description")} *</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t("products.description")}
          required
        />
      </div>

      <div className="form-group">
        <label>{t("products.category")} *</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder={t("products.category")}
          required
        />
      </div>

      <div className="form-group">
        <label>{t("products.quantity")}</label>
        <input
          type="number"
          name="Qtte"
          value={formData.Qtte}
          onChange={handleChange}
          min="0"
          placeholder={t("products.quantity")}
        />
      </div>

      <div className="form-group">
        <label>{t("products.purchasePrice")}</label>
        <input
          type="number"
          name="P_A"
          value={formData.P_A}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder={t("products.purchasePrice")}
        />
      </div>

      <div className="form-group">
        <label>{t("products.salePrice")}</label>
        <input
          type="number"
          name="P_V"
          value={formData.P_V}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder={t("products.salePrice")}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          <FaSave style={{ marginRight: 8 }} /> {t("products.save")}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          <FaTimes style={{ marginRight: 8 }} /> {t("products.cancel")}
        </button>
      </div>
    </form>
  )
}
