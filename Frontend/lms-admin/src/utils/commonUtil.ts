import { notification } from "antd";
import { Modal } from "antd";
export const showMessage = (success: boolean, msg: string) => {
  if (success) {
    notification.success({
      message: msg,
      placement: "topRight",
    });
  } else {
    notification.error({
      message: msg,
      placement: "topRight",
    });
  }
};

export const showConfirm = (message: string, callback: () => void) => {
  Modal.confirm({
    title: "Confirm?",
    content: message,
    okText: "Yes",
    cancelText: "No",
    onOk() {
      callback();
    },
    onCancel() {},
  });
};

export const formatDate = (isoDate: string) => {
  const formattedDate = new Date(isoDate).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formattedDate;
};
export const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = new Date(isoDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} ${time}`;
};

export const convertJsonToFormData = (jsonObj: any) => {
  const formData = new FormData();
  Object.keys(jsonObj).forEach((key) => {
    const value = jsonObj[key];
    formData.append(key, value);
  });
  return formData;
};

export const isJsonString = (value: any) => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

export const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear;
};
