"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import useCrud from "../hooks/useCrud"
import preparateurApi from "../api/preparateurApi"

import Modal from "../components/modals/Modal"
import PreparateurForm from "../components/forms/PreparateurForm"
import "../styles/pages/preparateurs.css"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"

export default function Preparateurs() {
  const { t } = useTranslation()
  const { items: preparateurs, loading: loadingPreparateurs, create, update, remove } = useCrud(preparateurApi)

  const [showModal, setShowModal] = useState(false)
  const [editingPreparateur, setEditingPreparateur] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const handleCreate = () => {
    setEditingPreparateur(null)
    setShowModal(true)
  }

  const handleEdit = (preparateur) => {
    setEditingPreparateur(preparateur)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm(t("preparateurs.confirmDelete"))) return
    try {
      await remove(id)
      alert(t("preparateurs.deleted"))
    } catch (err) {
      console.error("Failed to delete preparateur:", err)
      alert(t("preparateurs.deleteFailed"))
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingPreparateur) {
        await update(editingPreparateur.id, formData)
      } else {
        await create(formData)
      }
      alert(editingPreparateur ? t("preparateurs.updated") : t("preparateurs.created"))
      setShowModal(false)
      setEditingPreparateur(null)
    } catch (err) {
      console.error("Failed to save preparateur:", err)
      alert(t("preparateurs.saveFailed"))
    }
  }

  const filteredPreparateurs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return preparateurs
    return preparateurs.filter((prep) => {
      return (
        String(prep.id).includes(q) ||
        (prep.nom ?? prep.name ?? "").toLowerCase().includes(q) ||
        (prep.email ?? "").toLowerCase().includes(q) ||
        (prep.tele ?? prep.phone ?? "").toLowerCase().includes(q)
      )
    })
  }, [preparateurs, searchTerm])

  if (loadingPreparateurs) {
    return <div className="loading">{t("preparateurs.loading")}</div>
  }

  if (error) {
    return (
      <div className="preparateurs-page">
        <div className="error-banner">{error}</div>
      </div>
    )
  }

  return (
    <div className="preparateurs-page">
      <div className="page-header">
        <h1>{t("preparateurs.title")}</h1>
        <button className="btn-primary flex justify-center items-center" onClick={handleCreate}>
          <FaPlus style={{ marginRight: 8 }} /> {t("preparateurs.new")}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder={t("preparateurs.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredPreparateurs.length === 0 ? (
        <div className="empty-state">
          <p>{t("preparateurs.empty")}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("preparateurs.id")}</th>
                <th>{t("preparateurs.name")}</th>
                <th>{t("preparateurs.email")}</th>
                <th>{t("preparateurs.phone")}</th>
                <th>{t("preparateurs.createdAt")}</th>
                <th>{t("preparateurs.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredPreparateurs.map((prep) => (
                <tr key={prep.id} className="table-row">
                  <td>#{prep.id}</td>
                  <td>{prep.nom ?? prep.name ?? "-"}</td>
                  <td>{prep.email ?? "-"}</td>
                  <td>{prep.tele ?? prep.phone ?? "-"}</td>
                  <td>{prep.created_at ? new Date(prep.created_at).toLocaleString() : "-"}</td>
                  <td className="actions-cell">
                    <button className="btn-icon edit" onClick={() => handleEdit(prep)} title={t("preparateurs.edit")}>
                      <FaEdit />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(prep.id)} title={t("preparateurs.delete")}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPreparateur ? t("preparateurs.edit") : t("preparateurs.new")}
      >
        <PreparateurForm preparateur={editingPreparateur} onSave={handleSave} onCancel={() => setShowModal(false)} />
      </Modal>
    </div>
  )
}
