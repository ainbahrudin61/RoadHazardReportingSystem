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

export function formatTimeForDisplay(value) {
    if (!value) return "-";

    // If it's already a Date object
    if (value instanceof Date) {
        let hours = value.getHours();
        const minutes = String(value.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    }

    const str = String(value).trim();
    if (!str) return "-";

    // Matches 12-hour strings like "6:55 PM" or "06:55:03 pm"
    const t12 = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])$/);
    if (t12) {
        const hour = String(Number(t12[1])).padStart(2, "0");
        const minute = t12[2];
        const ampm = t12[3].toUpperCase();
        return `${hour}:${minute} ${ampm}`;
    }

    // Matches 24-hour strings like "18:55:03" or "06:05"
    const t24 = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (t24) {
        let h = Number(t24[1]);
        const m = t24[2];
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
    }

    // Fallback: try Date parse with today
    const parsed = new Date(`1970-01-01T${str}`);
    if (!isNaN(parsed.getTime())) {
        return formatTimeForDisplay(parsed);
    }

    return str;
}
