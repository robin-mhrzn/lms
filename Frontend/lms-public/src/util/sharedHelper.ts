import moment from "moment";
import { toast } from "sonner";

export const showMessage = (success: boolean, msg: string) => {
  toast(msg, {
    style: {
      backgroundColor: success ? "#D1FAE5" : "#FEE2E2", // Green for success, red for error
      color: success ? "#065F46" : "#B91C1C", // Dark green for success, dark red for error
      border: "1px solid",
      borderColor: success ? "#10B981" : "#EF4444", // Border color matches the type
      borderRadius: "8px",
      padding: "16px",
    },
    icon: success ? "✅" : "❌", // Success and error icons
  });
};

export const showConfirm = (message: string, callback: () => void) => {
  // reactSwal
  //   .fire({
  //     title: "Confirm?",
  //     text: message,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes",
  //     cancelButtonText: "No",
  //     reverseButtons: false,
  //     customClass: {
  //       confirmButton: "btn btn-primary",
  //       cancelButton: "btn btn-danger",
  //     },
  //   })
  //   .then((result) => {
  //     if (result.isConfirmed) {
  //       callback();
  //     }
  //   });
};

export const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear;
};

export const formatDate = (jsonDate: string) => {
  const date = new Date(jsonDate);
  const formattedDate = moment(date).format("MMMM Do, YYYY h:mm A ");
  return formattedDate;
};

export const formatDateOnly = (jsonDate: string) => {
  const date = new Date(jsonDate);
  const formattedDate = moment(date).format("MMMM Do, YYYY");
  return formattedDate;
};

export const convertJsonToFormData = (
  json: Record<string, any>,
  formData = new FormData(),
  parentKey = ""
): FormData => {
  // Loop through each key-value pair in the JSON object
  for (const [key, value] of Object.entries(json)) {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;
    // If the value is an array, recursively handle it
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        // For each item in the array, append it to FormData
        if (
          typeof item === "object" &&
          item !== null &&
          !(item instanceof File)
        ) {
          // For nested objects (like in "questions"), call the function recursively
          convertJsonToFormData(item, formData, `${formKey}[${index}]`);
        } else {
          formData.append(`${formKey}[${index}]`, item);
        }
      });
    } else if (value instanceof File) {
      // If the value is a File, append it directly to FormData
      formData.append(formKey, value);
    } else if (typeof value === "object" && value !== null) {
      // If the value is an object, call the function recursively
      convertJsonToFormData(value, formData, formKey);
    } else {
      // Otherwise, append the value to the FormData
      formData.append(formKey, value);
    }
  }
  return formData;
};
export const getImageUrl = (imageUrl?: string): string => {
  const domain = process.env.NEXT_PUBLIC_IMAGE_URL; //"https://localhost:7272/uploads/";
  if (!imageUrl) {
    return "/images/default.png"; // Default image path
  }
  return imageUrl.startsWith("http") ? imageUrl : `${domain}${imageUrl}`;
};

export const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};
