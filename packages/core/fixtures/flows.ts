import { parseDefinition } from "../src/definition";

// Entirely synthetic scenarios; no personal information or real organisation.
export const loan = parseDefinition({
  id: "equipment-loan",
  version: 1,
  steps: [
    {
      id: "equipment",
      title: "Choose equipment",
      fields: [
        {
          id: "equipment",
          label: "Equipment",
          kind: "choice",
          options: ["drill", "projector"],
          required: true,
        },
      ],
    },
    {
      id: "borrower",
      title: "Who is borrowing?",
      fields: [
        {
          id: "borrower",
          label: "Borrower type",
          kind: "choice",
          options: ["individual", "organisation"],
          required: true,
        },
      ],
    },
    {
      id: "organisation",
      title: "Organisation details",
      visibleWhen: { op: "equals", field: "borrower", value: "organisation" },
      fields: [
        {
          id: "organisationName",
          label: "Organisation name",
          kind: "text",
          required: true,
        },
      ],
    },
    {
      id: "dates",
      title: "Requested dates",
      rules: [
        { kind: "dateOrder", startField: "startDate", endField: "endDate" },
      ],
      fields: [
        { id: "startDate", label: "Start date", kind: "date", required: true },
        { id: "endDate", label: "End date", kind: "date", required: true },
      ],
    },
  ],
});
export const loanAnswers = {
  equipment: "drill",
  borrower: "individual",
  organisationName: "Synthetic workshop",
  startDate: "2026-12-01",
  endDate: "2026-12-03",
};

export const volunteer = parseDefinition({
  id: "volunteer",
  version: 1,
  steps: [
    {
      id: "role",
      title: "Choose a role",
      fields: [
        {
          id: "role",
          label: "Role",
          kind: "choice",
          options: ["repair", "welcome"],
          required: true,
        },
      ],
    },
    {
      id: "skills",
      title: "Repair skills",
      visibleWhen: { op: "equals", field: "role", value: "repair" },
      fields: [
        {
          id: "skills",
          label: "Skills",
          kind: "multiChoice",
          options: ["textiles", "electronics"],
          required: true,
        },
      ],
    },
    {
      id: "availability",
      title: "Availability",
      fields: [
        {
          id: "available",
          label: "Available for the morning?",
          kind: "boolean",
          required: true,
        },
      ],
    },
  ],
});
