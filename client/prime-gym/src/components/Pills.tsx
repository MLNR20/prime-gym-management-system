import React from "react"

interface Pills
{
    status: string
}
export default function Pills({status}: Pills): React.ReactElement {
    const normalizedStatus = status?.toString().trim().toLowerCase();

    const renderPill = (label: string, classes: string) => (
        <div className={`badge border-none ${classes}`}>{label}</div>
    );

    if (normalizedStatus === "active" || normalizedStatus === "success" || normalizedStatus === "paid" || normalizedStatus === "returned" || normalizedStatus === "available" || normalizedStatus === "yes") {
        return renderPill(normalizedStatus === "yes" ? "Yes" : status, "badge-soft bg-green-200 text-green-700 badge-success");
    }

    if (normalizedStatus === "inactive" || normalizedStatus === "error" || normalizedStatus === "expired" || normalizedStatus === "borrowed" || normalizedStatus === "true" || normalizedStatus === "out of stock") {
        return renderPill(normalizedStatus === "inactive" ? "Inactive" : normalizedStatus === "out of stock" ? "Out of Stock" : status, "badge-soft bg-red-200 text-red-700 badge-error");
    }

    if (normalizedStatus === "for repair" || normalizedStatus === "low stock" || normalizedStatus === "pending") {
        return renderPill(normalizedStatus === "low stock" ? "Low Stock" : status, "badge-soft badge-warning bg-amber-200 text-amber-700");
    }

    if (normalizedStatus === "under repair" || normalizedStatus === "discontinued") {
        return renderPill(normalizedStatus === "discontinued" ? "Discontinued" : status, "badge-soft bg-gray-200 text-gray-700");
    }

    if (normalizedStatus === "false" || normalizedStatus === "no") {
        return renderPill(normalizedStatus === "false" ? "Active" : "No", "badge-soft bg-gray-200 text-gray-700");
    }

    return renderPill(status, "badge-ghost bg-gray-200 text-gray-700");
}