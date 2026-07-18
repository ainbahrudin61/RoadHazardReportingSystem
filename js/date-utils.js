function parseDateValue(value) {
    if (!value) return null;

    if (value instanceof Date) {
        return {
            year: value.getFullYear(),
            month: value.getMonth() + 1,
            day: value.getDate()
        };
    }

    if (typeof value !== "string") return null;

    const trimmed = value.trim();
    if (!trimmed || trimmed === "-") return null;

    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
        return {
            year: Number(isoMatch[1]),
            month: Number(isoMatch[2]),
            day: Number(isoMatch[3])
        };
    }

    const dmyMatch = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (dmyMatch) {
        return {
            year: Number(dmyMatch[3]),
            month: Number(dmyMatch[2]),
            day: Number(dmyMatch[1])
        };
    }

    return null;
}

export function formatDateForDisplay(value) {
    const parsed = parseDateValue(value);
    if (!parsed) {
        return value || "-";
    }

    return `${String(parsed.day).padStart(2, "0")}-${String(parsed.month).padStart(2, "0")}-${parsed.year}`;
}

export function formatDateForInput(value) {
    const parsed = parseDateValue(value);
    if (!parsed) {
        return "";
    }

    return `${parsed.year}-${String(parsed.month).padStart(2, "0")}-${String(parsed.day).padStart(2, "0")}`;
}

export function normalizeDateForComparison(value) {
    const parsed = parseDateValue(value);
    if (!parsed) {
        return value || "";
    }

    return `${parsed.year}-${String(parsed.month).padStart(2, "0")}-${String(parsed.day).padStart(2, "0")}`;
}
