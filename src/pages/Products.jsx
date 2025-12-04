"use client"

import React, { useState, useMemo } from "react"
import useCrud from "../hooks/useCrud"
import productApi from "../api/produitApi"

import Modal from "../components/modals/Modal"
import ProductForm from "../components/forms/ProductForm"
import "../styles/pages/products.css"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import { useTranslation } from "react-i18next"

export default function Products() {
  const { t } = useTranslation()
  const { items: products, loading: loadingProducts, create, update, remove } = useCrud(productApi)

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const handleCreate = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm(t("products.confirmDelete"))) return
    try {
      await remove(id)
      alert(t("products.deleted"))
    } catch (err) {
      console.error("Failed to delete product:", err)
      alert(t("products.deleteFailed"))
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingProduct) {
        await update(editingProduct.id, formData)
      } else {
        await create(formData)
      }
      alert(editingProduct ? t("products.updated") : t("products.created"))
      setShowModal(false)
      setEditingProduct(null)
    } catch (err) {
      console.error("Failed to save product:", err)
      alert(t("products.saveFailed"))
    }
  }

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return products
    return products.filter((product) => {
      return (
        String(product.id).includes(q) ||
        (product.description ?? product.name ?? "").toLowerCase().includes(q) ||
        (product.category ?? "").toLowerCase().includes(q) ||
        String(product.Qtte ?? "").toLowerCase().includes(q) ||
        String(product.P_A ?? "").toLowerCase().includes(q) ||
        String(product.P_V ?? "").toLowerCase().includes(q)
      )
    })
  }, [products, searchTerm])

  if (loadingProducts) {
    return <div className="loading">{t("products.loading")}</div>
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-banner">{t("products.error")}</div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>{t("products.title")}</h1>
        <button className="btn-primary" onClick={handleCreate}>
          <FaPlus style={{ marginRight: 8 }} /> {t("products.new")}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder={t("products.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>{t("products.empty")}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("products.id")}</th>
                <th>{t("products.description")}</th>
                <th>{t("products.category")}</th>
                <th>{t("products.quantity")}</th>
                <th>{t("products.purchasePrice")}</th>
                <th>{t("products.salePrice")}</th>
                <th>{t("products.createdAt")}</th>
                <th>{t("products.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="table-row">
                  <td>#{product.id}</td>
                  <td>{product.description ?? product.name ?? "-"}</td>
                  <td>{product.category ?? "-"}</td>
                  <td>{product.Qtte ?? "-"}</td>
                  <td>{Number.parseFloat(product.P_A).toFixed(2) ?? "-"}DH</td>
                  <td>{Number.parseFloat(product.P_V).toFixed(2) ?? "-"}DH</td>
                  <td>{product.created_at ? new Date(product.created_at).toLocaleString() : "-"}</td>
                  <td className="actions-cell">
                    <button className="btn-icon edit" onClick={() => handleEdit(product)} title={t("products.edit")}>
                      <FaEdit />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(product.id)} title={t("products.delete")}>
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
        title={editingProduct ? t("products.edit") : t("products.new")}
      >
        <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setShowModal(false)} />
      </Modal>
    </div>
  )
}
