"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import useCrud from "../hooks/useCrud"
import livreurApi from "../api/livreurApi"

import Modal from "../components/modals/Modal"
import LivreurForm from "../components/forms/LivreurForm"
import "../styles/pages/livreurs.css"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"

export default function Livreurs() {
  const { t } = useTranslation()
  const { items: livreurs, loading: loadingLivreurs, create, update, remove } = useCrud(livreurApi)

  const [showModal, setShowModal] = useState(false)
  const [editingLivreur, setEditingLivreur] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const handleCreate = () => {
    setEditingLivreur(null)
    setShowModal(true)
  }

  const handleEdit = (livreur) => {
    setEditingLivreur(livreur)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm(t("livreurs.confirmDelete"))) return
    try {
      await remove(id)
      alert(t("livreurs.deleted"))
    } catch (err) {
      console.error("Failed to delete livreur:", err)
      alert(t("livreurs.deleteFailed"))
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingLivreur) {
        await update(editingLivreur.id, formData)
      } else {
        await create(formData)
      }
      alert(editingLivreur ? t("livreurs.updated") : t("livreurs.created"))
      setShowModal(false)
      setEditingLivreur(null)
    } catch (err) {
      console.error("Failed to save livreur:", err)
      alert(t("livreurs.saveFailed"))
    }
  }

  const filteredLivreurs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return livreurs
    return livreurs.filter((livreur) => {
      return (
        String(livreur.id).includes(q) ||
        (livreur.nom ?? livreur.name ?? "").toLowerCase().includes(q) ||
        (livreur.tele ?? livreur.phone ?? "").toLowerCase().includes(q)
      )
    })
  }, [livreurs, searchTerm])

  if (loadingLivreurs) {
    return <div className="loading">{t("livreurs.loading")}</div>
  }

  if (error) {
    return (
      <div className="livreurs-page">
        <div className="error-banner">{error}</div>
      </div>
    )
  }

  return (
    <div className="livreurs-page">
      <div className="page-header">
        <h1>{t("livreurs.title")}</h1>
        <button className="btn-primary flex justify-center items-center" onClick={handleCreate}>
          <FaPlus style={{ marginRight: 8 }} /> {t("livreurs.new")}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder={t("livreurs.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredLivreurs.length === 0 ? (
        <div className="empty-state">
          <p>{t("livreurs.empty")}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("livreurs.id")}</th>
                <th>{t("livreurs.name")}</th>
                <th>{t("livreurs.phone")}</th>
                <th>{t("livreurs.createdAt")}</th>
                <th>{t("livreurs.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLivreurs.map((livreur) => (
                <tr key={livreur.id} className="table-row">
                  <td>#{livreur.id}</td>
                  <td>{livreur.nom ?? livreur.name ?? "-"}</td>
                  <td>{livreur.tele ?? livreur.phone ?? "-"}</td>
                  <td>{livreur.created_at ? new Date(livreur.created_at).toLocaleString() : "-"}</td>
                  <td className="actions-cell">
                    <button className="btn-icon edit" onClick={() => handleEdit(livreur)} title={t("livreurs.edit")}>
                      <FaEdit />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(livreur.id)} title={t("livreurs.delete")}>
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
        title={editingLivreur ? t("livreurs.edit") : t("livreurs.new")}
      >
        <LivreurForm livreur={editingLivreur} onSave={handleSave} onCancel={() => setShowModal(false)} />
      </Modal>
    </div>
  )
}
