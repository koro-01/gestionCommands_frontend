"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { FaSave, FaTimes } from "react-icons/fa"

export default function PreparateurForm({ preparateur, onSave, onCancel }) {
  const { t } = useTranslation()
  const initIdRef = useRef(null)

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    tele: "",
  })

  useEffect(() => {
    if (preparateur && initIdRef.current !== preparateur.id) {
      setFormData({
        nom: preparateur.nom ?? preparateur.name ?? "",
        email: preparateur.email ?? "",
        tele: preparateur.tele ?? preparateur.phone ?? "",
      })
      initIdRef.current = preparateur.id
    }
  }, [preparateur?.id])

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
      alert(t("preparateurs.saveFailed"))
      return
    }
    onSave(formData)
  }

  return (
    <form className="command-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t("preparateurs.name")} *</label>
        <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>{t("preparateurs.email")}</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>{t("preparateurs.phone")}</label>
        <input type="text" name="tele" value={formData.tele} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          <FaSave style={{ marginRight: 8 }} /> {t("preparateurs.save")}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          <FaTimes style={{ marginRight: 8 }} /> {t("preparateurs.cancel")}
        </button>
      </div>
    </form>
  )
}
