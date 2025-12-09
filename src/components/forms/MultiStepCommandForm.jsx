"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ClientInfoStep from "./steps/ClientInfoStep";
import ProductSelectionStep from "./steps/ProductSelectionStep";
import LogisticsStatusStep from "./steps/LogisticsStatusStep";

export default function MultiStepCommandForm({
  command,
  onSave,
  onCancel,
  products,
  livreurs,
  preparateurs,
}) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState(
    command || {
      nom: "",
      phone: "",
      destination: "",
      productId: "",
      livreurId: "",
      preparateurId: "",
      status: "pending",
      quantity: 1,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value || 0) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      nom: formData.nom || null,
      phone: formData.phone || null,
      destination: formData.destination || null,
      produit_id: Number(formData.productId),
      livreur_id: Number(formData.livreurId),
      preparateur_id: Number(formData.preparateurId),
      status: formData.status,
      Qtte: Number(formData.quantity),
    };

    onSave(payload);
  };

  const steps = [
    <ClientInfoStep
      key="client"
      formData={formData}
      handleChange={handleChange}
      handleNext={() => setCurrentStep(1)}
      onCancel={onCancel}
    />,
    <ProductSelectionStep
      key="products"
      formData={formData}
      handleChange={handleChange}
      handleNext={() => setCurrentStep(2)}
      handlePrevious={() => setCurrentStep(0)}
      onCancel={onCancel}
      products={products}
    />,
    <LogisticsStatusStep
      key="logistics"
      formData={formData}
      handleChange={handleChange}
      handlePrevious={() => setCurrentStep(1)}
      onSave={handleSubmit}
      onCancel={onCancel}
      livreurs={livreurs}
      preparateurs={preparateurs}
    />,
  ];

  return (
    <div className="multi-step-command-form-container">

      {/* Updated Step Indicator */}
  <div className="step-indicator flex justify-center items-center gap-4 mb-6">

  {/* Step 1 */}
  <div
    className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all duration-300 select-none
      ${currentStep === 0 ? "scale-110 ring-2 ring-current" : "opacity-50"}
    `}
  >
    1
  </div>

  {/* Line 1 */}
  <div className="w-14 h-[2px] bg-current opacity-50"></div>

  {/* Step 2 */}
  <div
    className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all duration-300 select-none
      ${currentStep === 1 ? "scale-110 ring-2 ring-current" : "opacity-50"}
    `}
  >
    2
  </div>

  {/* Line 2 */}
  <div className="w-14 h-[2px] bg-current opacity-50"></div>

  {/* Step 3 */}
  <div
    className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all duration-300 select-none
      ${currentStep === 2 ? "scale-110 ring-2 ring-current" : "opacity-50"}
    `}
  >
    3
  </div>
</div>



      {steps[currentStep]}
    </div>
  );
}
