export const getDuration = (dateString: any) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
    return formattedDate;
};