"use client";

import React, { useEffect, useState, useMemo } from "react";
import useCrud from "../hooks/useCrud";
import commandeApi from "../api/commandeApi";
import produitApi from "../api/produitApi";
import livreurApi from "../api/livreurApi";
import preparateurApi from "../api/preparateurApi";

import Modal from "../components/modals/Modal";
import CommandForm from "../components/forms/CommandForm";
import "../styles/pages/commands.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Commands() {
  const { t } = useTranslation();

  const {
    items: commands = [],
    loading: loadingCommands,
    create,
    update,
    remove,
  } = useCrud(commandeApi);

  const [relatedLoading, setRelatedLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [preparateurs, setPreparateurs] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchRelated = async () => {
    try {
      setRelatedLoading(true);
      const [pRes, lRes, prRes] = await Promise.all([
        produitApi.getAll(),
        livreurApi.getAll(),
        preparateurApi.getAll(),
      ]);
      setProducts(pRes?.data ?? pRes ?? []);
      setLivreurs(lRes?.data ?? lRes ?? []);
      setPreparateurs(prRes?.data ?? prRes ?? []);
    } catch (err) {
      console.error("Failed loading related data", err);
      setError(t("commands.errorLoadingRelated"));
    } finally {
      setRelatedLoading(false);
    }
  };

  useEffect(() => {
    fetchRelated();
  }, []);

  const prodMap = useMemo(
    () =>
      (products || []).reduce((m, p) => {
        m[String(p.id)] = p;
        return m;
      }, {}),
    [products]
  );
  const livMap = useMemo(
    () =>
      (livreurs || []).reduce((m, l) => {
        m[String(l.id)] = l;
        return m;
      }, {}),
    [livreurs]
  );
  const prepMap = useMemo(
    () =>
      (preparateurs || []).reduce((m, p) => {
        m[String(p.id)] = p;
        return m;
      }, {}),
    [preparateurs]
  );

  const displayCommands = useMemo(() => {
    return (commands || []).map((c) => {
      const prod = c.product ?? prodMap[String(c.produit_id)] ?? null;
      const liv = c.livreur ?? livMap[String(c.livreur_id)] ?? null;
      const prep = c.preparateur ?? prepMap[String(c.preparateur_id)] ?? null;

      const normalizedProduct = prod
        ? {
            id: prod.id,
            description: prod.description ?? "",
            category: prod.category ?? "",
            Qtte: prod.Qtte ?? null,
            P_A: prod.P_A ?? null,
            P_V: prod.P_V ?? null,
            displayName: prod.description ?? prod.nom ?? prod.name ?? "",
            ...prod,
          }
        : null;

      const quantity = Number(
        c.Qtte ?? c.quantity ?? normalizedProduct?.Qtte ?? 1
      );

      return {
        ...c,
        product: normalizedProduct,
        livreur: liv
          ? { id: liv.id, name: liv.nom ?? liv.name ?? "", ...liv }
          : null,
        preparateur: prep
          ? { id: prep.id, name: prep.nom ?? prep.name ?? "", ...prep }
          : null,
        quantity,
      };
    });
  }, [commands, prodMap, livMap, prepMap]);

  const loading = loadingCommands || relatedLoading;

  const handleCreate = () => {
    setEditingCommand(null);
    setShowModal(true);
  };

  const handleEdit = (command) => {
    setEditingCommand(command);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm(t("confirmation.delete"))) return;
    try {
      await remove(id);
      await fetchRelated();
    } catch (err) {
      console.error("Failed to delete command:", err);
      alert(t("commands.deleteError", "Failed to delete command"));
    }
  };
  const handleSave = async (formData) => {
    try {
      let response;
      if (editingCommand) {
        response = await update(editingCommand.id, formData);
      } else {
        response = await create(formData);
      }

      // Check backend response for stock issues
      if (response?.data?.message === "Not enough stock") {
        alert(
          `⚠ ${response.data.message}. Available stock: ${response.data.stock}`
        );
        return; // stop further execution
      }

      await fetchRelated();
      alert(editingCommand ? t("modal.editTitle") : t("modal.createTitle"));
      setShowModal(false);
      setEditingCommand(null);
    } catch (err) {
      console.error("Failed to save command:", err);

      // Check if backend returned stock error in error response
      if (err.response?.data?.message === "Not enough stock") {
        alert(
          `⚠ ${err.response.data.message}. Available stock: ${err.response.data.stock}`
        );
      } else {
        alert(t("commands.saveError", "Failed to save command"));
      }
    }
  };

  const filteredCommands = displayCommands.filter((cmd) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      String(cmd.id).includes(q) ||
      (cmd.product?.description ?? cmd.product?.displayName ?? "")
        .toLowerCase()
        .includes(q) ||
      (cmd.livreur?.name ?? "").toLowerCase().includes(q) ||
      (cmd.preparateur?.name ?? "").toLowerCase().includes(q) ||
      (cmd.status ?? "").toLowerCase().includes(q) ||
      String(cmd.quantity ?? "")
        .toLowerCase()
        .includes(q)
    );
  });

  const totalPrice = useMemo(() => {
    return filteredCommands.reduce((sum, cmd) => {
      const qty = Number(cmd.quantity ?? cmd.product?.Qtte ?? 0);
      const price = parseFloat(cmd.product?.P_V ?? cmd.P_V ?? 0) || 0;
      return sum + qty * price;
    }, 0);
  }, [filteredCommands]);

  const totalPriceFormatted = totalPrice.toFixed(2);

  if (error) {
    return (
      <div className="commands-page">
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  return (
    <div className="commands-page">
      <div className="page-header">
        <h1>{t("commands.title")}</h1>
        <button className="btn-primary" onClick={handleCreate}>
          <FaPlus style={{ marginRight: 8 }} /> {t("commands.newCommand")}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder={t("commands.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">
          {t("commands.loading", "Loading commands...")}
        </div>
      ) : filteredCommands.length === 0 ? (
        <div className="empty-state">
          <p>{t("commands.noCommands")}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("commands.id")}</th>
                <th>{t("commands.product")}</th>
                <th>{t("commands.category")}</th>
                <th>{t("commands.destination")}</th>
                <th>{t("commands.client")}</th>
                <th>{t("commands.phone")}</th>
                <th>{t("commands.stock")}</th>
                <th>{t("commands.deliveryPerson")}</th>
                <th>{t("commands.preparateur")}</th>
                <th>{t("commands.status")}</th>
                <th>{t("commands.quantity")}</th>
                <th>{t("commands.unitPrice")}</th>
                <th>{t("commands.total")}</th>
                <th>{t("commands.date")}</th>
                <th>{t("commands.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommands.map((command) => {
                const stock = Number(command.product?.Qtte ?? 0);
                const qty = Number(
                  command.quantity ?? command.product?.Qtte ?? 0
                );
                const unitPrice =
                  parseFloat(command.product?.P_V ?? command.P_V ?? 0) || 0;
                const rowTotal = (qty * unitPrice).toFixed(2);

                return (
                  <tr key={command.id} className="table-row">
                    <td>#{command.id}</td>
                    <td>{command.product?.description ?? "-"}</td>
                    <td>{command.product?.category ?? "-"}</td>
                    <td>{command.destination ?? "-"}</td>
                    <td>{command.nom ?? "-"}</td>
                    <td>{command.phone ?? "-"}</td>
                    <td>{Number.isFinite(stock) ? stock : "-"}</td>
                    <td>{command.livreur?.name || "-"}</td>
                    <td>{command.preparateur?.name || "-"}</td>
                    <td>
                      <span className={`status-badge status-${command.status}`}>
                        {command.status}
                      </span>
                    </td>
                    <td>{qty}</td>
                    <td>{unitPrice.toFixed(2)}DH</td>
                    <td>{rowTotal}DH</td>
                    <td>
                      {command.created_at
                        ? new Date(command.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon edit"
                        onClick={() => handleEdit(command)}
                        title={t("commands.edit")}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(command.id)}
                        title={t("commands.delete")}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="table-row total-row">
                <td
                  colSpan={12}
                  style={{ textAlign: "right", fontWeight: 700 }}
                >
                  {t("commands.totalPrice")}:
                </td>
                <td style={{ fontWeight: 700 }}>{totalPriceFormatted}</td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCommand ? t("modal.editTitle") : t("modal.createTitle")}
      >
        <CommandForm
          command={editingCommand}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          products={products}
          livreurs={livreurs}
          preparateurs={preparateurs}
        />
      </Modal>
    </div>
  );
}
