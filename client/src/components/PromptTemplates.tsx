import React, { useState } from "react";

const templates = [
  {
    id: 1,
    name: "تسويق منتج",
    template:
      "اكتب منشور تسويقي عن منتج {{product_name}} يستهدف فئة {{target_audience}} ويبرز ميزة {{main_feature}}.",
    variables: ["product_name", "target_audience", "main_feature"],
  },
  {
    id: 2,
    name: "شرح تعليمي",
    template:
      "اشرح مفهوم {{concept}} للطلاب في مرحلة {{grade_level}} مع أمثلة من الحياة اليومية.",
    variables: ["concept", "grade_level"],
  },
  {
    id: 3,
    name: "أسئلة اختيار من متعدد",
    template:
      "أنشئ 5 أسئلة اختيار من متعدد حول موضوع {{topic}} للصف {{class}}.",
    variables: ["topic", "class"],
  },
];

export default function PromptTemplates() {
  const [selected, setSelected] = useState<number | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSelect = (id: number) => {
    setSelected(id);
    setValues({});
  };

  const handleChange = (variable: string, value: string) => {
    setValues((prev) => ({ ...prev, [variable]: value }));
  };

  const getFinalPrompt = () => {
    if (selected === null) return "";
    let prompt = templates.find((t) => t.id === selected)?.template || "";
    templates
      .find((t) => t.id === selected)
      ?.variables.forEach((v) => {
        prompt = prompt.replace(`{{${v}}}`, values[v] || "____");
      });
    return prompt;
  };

  return (
    <div>
      <h2>🧩 اختر قالب برومبت جاهز</h2>
      <ul>
        {templates.map((t) => (
          <li key={t.id}>
            <button onClick={() => handleSelect(t.id)}>{t.name}</button>
          </li>
        ))}
      </ul>
      {selected !== null && (
        <div style={{ marginTop: 20 }}>
          <h3>تعديل القيم:</h3>
          {templates
            .find((t) => t.id === selected)
            ?.variables.map((v) => (
              <div key={v}>
                <label>{v}: </label>
                <input
                  type="text"
                  value={values[v] || ""}
                  onChange={(e) => handleChange(v, e.target.value)}
                />
              </div>
            ))}
          <h4 style={{ marginTop: 20 }}>البرومبت النهائي:</h4>
          <textarea
            rows={3}
            style={{ width: "100%" }}
            value={getFinalPrompt()}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
