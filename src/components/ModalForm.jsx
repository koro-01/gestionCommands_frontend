import { useState, useEffect, useMemo, useTransition } from "react";

export default function ModalForm({ fields = [], onSubmit = () => {}, editingData = {} }) {
  const computeInitial = (fieldsArr, editing) => {
    const initial = {};
    (fieldsArr || []).forEach((f) => {
      if (typeof f === "string") {
        initial[f] = editing?.[f] ?? "";
      } else if (f && typeof f === "object" && f.name) {
        initial[f.name] = editing?.[f.name] ?? (f.defaultValue ?? "");
      }
    });

    Object.keys(editing || {}).forEach((k) => {
      if (!(k in initial)) initial[k] = editing[k];
    });

    return initial;
  };

  const initialForm = useMemo(() => computeInitial(fields, editingData), [fields, editingData]);
  const [form, setForm] = useState(initialForm);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // schedule the update as a non-urgent transition to avoid synchronous setState warning
    startTransition(() => {
      setForm(initialForm);
    });
  }, [initialForm, startTransition]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit}>
      {(fields || []).map((field) => {
        const name = typeof field === "string" ? field : field.name;
        const label = typeof field === "string" ? field : field.label ?? field.name;
        const type = typeof field === "string" ? "text" : field.type ?? "text";
        return (
          <div key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              value={type === "checkbox" ? undefined : form[name] ?? ""}
              checked={type === "checkbox" ? !!form[name] : undefined}
              onChange={handleChange}
            />
          </div>
        );
      })}
      <button type="submit">Save</button>
    </form>
  );
}
