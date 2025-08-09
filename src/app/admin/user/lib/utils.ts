const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(dateString));
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};


export { formatDate };