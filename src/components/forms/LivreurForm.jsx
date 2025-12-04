"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { FaSave, FaTimes } from "react-icons/fa"

export default function LivreurForm({ livreur, onSave, onCancel }) {
  const { t } = useTranslation()
  const initIdRef = useRef(null)

  const [formData, setFormData] = useState({
    nom: "",
    tele: "",
  })

  useEffect(() => {
    if (livreur && initIdRef.current !== livreur.id) {
      setFormData({
        nom: livreur.nom ?? livreur.name ?? "",
        tele: livreur.tele ?? livreur.phone ?? "",
      })
      initIdRef.current = livreur.id
    }
  }, [livreur?.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nom) {
      alert(t("livreurs.saveFailed"))
      return
    }

    onSave(formData)
  }

  return (
    <form className="command-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t("livreurs.name")} *</label>
        <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>{t("livreurs.phone")}</label>
        <input type="text" name="tele" value={formData.tele} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          <FaSave style={{ marginRight: 8 }} /> {t("livreurs.save")}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          <FaTimes style={{ marginRight: 8 }} /> {t("livreurs.cancel")}
        </button>
      </div>
    </form>
  )
}
