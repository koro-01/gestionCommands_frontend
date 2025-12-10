// components/forms/CreateCommandWizard.jsx
"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight, FaSave, FaTimes } from "react-icons/fa";
import "../../styles/components/create-command-wizard.css";

const steps = [
  { id: 1, name: "Client Info" },
  { id: 2, name: "Product & Stock" },
  { id: 3, name: "Preparation" },
  { id: 4, name: "Delivery" },
  { id: 5, name: "Review" },
];

export default function CommandForm({
  command,
  onSave,
  onCancel,
  products = [],
  livreurs = [],
  preparateurs = [],
}) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    nom: command?.nom || "",
    phone: command?.phone || "",
    destination: command?.destination || "",
    productId: command?.produit_id || "",
    quantity: command?.Qtte || 1,
    preparateurId: command?.preparateur_id || "",
    livreurId: command?.livreur_id || "",
    status: command?.status || "pending",
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (formData.productId) {
      const prod = products.find((p) => p.id === Number(formData.productId));
      setSelectedProduct(prod);
    }
  }, [formData.productId, products]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.nom && formData.phone && formData.destination;
      case 2:
        return formData.productId && formData.quantity > 0;
      case 3:
        return formData.preparateurId;
      case 4:
        return formData.livreurId;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    const payload = {
      nom: formData.nom,
      phone: formData.phone,
      destination: formData.destination,
      produit_id: Number(formData.productId),
      Qtte: Number(formData.quantity),
      preparateur_id: Number(formData.preparateurId),
      livreur_id: Number(formData.livreurId),
      status: formData.status,
    };
    onSave(payload);
  };

  const availableStock = selectedProduct?.Qtte || 0;
  const notEnoughStock = formData.quantity > availableStock;

  return (
    <div className="wizard-container">
      {/* Progress Bar */}
     <div
  className="wizard-steps"
  style={{
    "--current-step": currentStep,
    "--total-steps": steps.length,
  }}
>
  {steps.map((step, index) => (
    <div key={step.id} className={`step ${currentStep >= step.id ? "active" : ""} ${currentStep > step.id ? "completed" : ""}`}>
      <div className="step-circle">{currentStep > step.id ? "✓" : step.id}</div>
      <div className="step-label">{t(`wizard.step${step.id}`) || step.name}</div>
    </div>
  ))}
</div>


      <div className="wizard-content">
        {/* Step 1: Client Info */}
        {currentStep === 1 && (
          <div className="step-panel">
            <h3>{t("wizard.clientInfo")}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>{t("commands.formCommand.nom")}</label>
                <input
                  value={formData.nom}
                  onChange={(e) => updateField("nom", e.target.value)}
                  placeholder="Ahmed Mohamed"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("commands.formCommand.phone")}</label>
                <input
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+212 6 00 00 00 00"
                />
              </div>
              <div className="form-group full">
                <label>{t("commands.formCommand.destination")}</label>
                <input
                  value={formData.destination}
                  onChange={(e) => updateField("destination", e.target.value)}
                  placeholder="Casablanca, Maarif..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Product & Stock */}
        {currentStep === 2 && (
          <div className="step-panel">
            <h3>{t("wizard.productStock")}</h3>
            <div className="form-group">
              <label>{t("commands.formCommand.product")}</label>
              <select
                value={formData.productId}
                onChange={(e) => updateField("productId", e.target.value)}
              >
                <option value="">{t("commands.formCommand.selectProduct")}</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.description} ({p.Qtte} in stock)
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <>
                <div className="stock-info">
                  <strong>Stock: {availableStock} units</strong>
                  {notEnoughStock && (
                    <p className="text-red-600 font-bold">
                      Not enough stock! Only {availableStock} available.
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>{t("commands.formCommand.quantity")}</label>
                  <input
                    type="number"
                    min="1"
                    max={availableStock}
                    value={formData.quantity}
                    onChange={(e) => updateField("quantity", parseInt(e.target.value) || 1)}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Preparation */}
        {currentStep === 3 && (
          <div className="step-panel">
            <h3>{t("wizard.preparation")}</h3>
            <div className="form-group">
              <label>{t("commands.formCommand.preparateur")}</label>
              <select
                value={formData.preparateurId}
                onChange={(e) => updateField("preparateurId", e.target.value)}
              >
                <option value="">{t("commands.formCommand.selectPreparateur")}</option>
                {preparateurs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Delivery */}
        {currentStep === 4 && (
          <div className="step-panel">
            <h3>{t("wizard.delivery")}</h3>
            <div className="form-group">
              <label>{t("commands.formCommand.deliveryPerson")}</label>
              <select
                value={formData.livreurId}
                onChange={(e) => updateField("livreurId", e.target.value)}
              >
                <option value="">{t("commands.formCommand.selectLivreur")}</option>
                {livreurs.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="step-panel">
            <h3>{t("wizard.review")}</h3>
            <div className="review-grid">
              <div><strong>Client:</strong> {formData.nom}</div>
              <div><strong>Phone:</strong> {formData.phone}</div>
              <div><strong>Address:</strong> {formData.destination}</div>
              <div><strong>Product:</strong> {selectedProduct?.description}</div>
              <div><strong>Quantity:</strong> {formData.quantity}</div>
              <div><strong>Preparer:</strong> {preparateurs.find(p => p.id === Number(formData.preparateurId))?.nom}</div>
              <div><strong>Deliverer:</strong> {livreurs.find(l => l.id === Number(formData.livreurId))?.nom}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="wizard-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          <FaTimes /> {t("commands.formCommand.cancel")}
        </button>

        <div className="flex gap-3">
          {currentStep > 1 && (
            <button type="button" className="btn-outline" onClick={prevStep}>
              <FaChevronLeft /> Previous
            </button>
          )}
          {currentStep < 5 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={nextStep}
              disabled={!isStepValid() || (currentStep === 2 && notEnoughStock)}
            >
              Next <FaChevronRight />
            </button>
          ) : (
            <button
              type="button"
              className="btn-success"
              onClick={handleSubmit}
              disabled={notEnoughStock}
            >
              <FaSave /> {command ? "Update" : "Create"} Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}