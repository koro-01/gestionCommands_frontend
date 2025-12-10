"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import CommandForm from "../components/forms/CommandForm";
import commandeApi from "../api/commandeApi";
import produitApi from "../api/produitApi";
import livreurApi from "../api/livreurApi";
import preparateurApi from "../api/preparateurApi";

export default function NewCommandPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();

  const isEdit = Boolean(params?.id);
  const commandId = isEdit ? params.id : null;

  const [command, setCommand] = useState(null);
  const [products, setProducts] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [preparateurs, setPreparateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pRes, lRes, prRes] = await Promise.all([
          produitApi.getAll(),
          livreurApi.getAll(),
          preparateurApi.getAll(),
        ]);

        setProducts(pRes?.data ?? []);
        setLivreurs(lRes?.data ?? []);
        setPreparateurs(prRes?.data ?? []);

        if (isEdit) {
          const cmdRes = await commandeApi.getById(commandId);
          setCommand(cmdRes?.data ?? null);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [commandId, isEdit]);

  const handleSave = async (payload) => {
    try {
      if (isEdit) {
        await commandeApi.update(commandId, payload);
        alert("Command updated successfully!");
      } else {
        await commandeApi.create(payload);
        alert("Command created successfully!");
      }
      navigate("/commands");
    } catch (err) {
      if (err.response?.data?.message === "Not enough stock") {
        alert(`Not enough stock! Available: ${err.response.data.stock}`);
      } else {
        alert("Failed to save command");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isEdit ? t("commands.editCommand") : t("commands.newCommand")}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit ? "Update command details" : "Fill in the order step by step"}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-xl">{t("loading")}...</div>
        </div>
      ) : (
        <CommandForm
          command={command}
          onSave={handleSave}
          onCancel={() => navigate("/commands")}
          products={products}
          livreurs={livreurs}
          preparateurs={preparateurs}
        />
      )}
    </div>
  );
}
