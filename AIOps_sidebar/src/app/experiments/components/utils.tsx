"use client";

import { MdCheckCircle, MdHourglassEmpty, MdError } from "react-icons/md";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "#10b981";
    case "Running":
      return "#3b82f6";
    case "Failed":
      return "#ef4444";
    default:
      return "#64748b";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <MdCheckCircle />;
    case "Running":
      return <MdHourglassEmpty />;
    case "Failed":
      return <MdError />;
    default:
      return <MdHourglassEmpty />;
  }
};
