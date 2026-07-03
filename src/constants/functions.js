import { confirmAlert } from "react-confirm-alert";

// get today's date
export const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// format date in yyyy-mm-dd
export const formatDateInReverse = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${year}-${month}-${day}`;
};

// format date in dd-mm-yyyy
export const formatDateInHyphen = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}-${month}-${year}`;
};









// confirm delete
export const confirmAction = (data, apiFunctionCall) => {
  confirmAlert({
    title: "Confirm Action",
    message: "Are you sure about this?",
    buttons: [
      {
        label: "Yes",
        onClick: () => apiFunctionCall(data),
      },
      {
        label: "No",
      },
    ],
  });
};



