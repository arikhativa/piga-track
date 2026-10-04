// TODO use this in any ₪ place
export const formatNIS = (value: number) =>
    `${
        new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0,
        }).format(value)
    } ₪`;
