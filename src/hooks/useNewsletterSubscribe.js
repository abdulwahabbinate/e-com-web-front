import { useState } from "react";
import toast from "react-hot-toast";
import { newsletterService } from "../services/newsletterService";

const baseToastStyle = {
  borderRadius: "16px",
  color: "#ffffff",
  padding: "14px 18px",
  fontSize: "14px",
  fontWeight: "600",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.24)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const getErrorMessage = (error) => {
  if (Array.isArray(error?.response?.errors) && error.response.errors.length) {
    return error.response.errors[0]?.message || "Subscription failed";
  }

  return error?.response?.message || error?.message || "Subscription failed";
};

export const useNewsletterSubscribe = (source = "homepage") => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const toastId = toast.loading("Subscribing you...", {
      style: {
        ...baseToastStyle,
        background: "linear-gradient(135deg, #312e81 0%, #4338ca 100%)",
      },
      iconTheme: {
        primary: "#c7d2fe",
        secondary: "#312e81",
      },
    });

    try {
      setLoading(true);

      const result = await newsletterService.subscribe({
        email: normalizedEmail,
        source,
      });

      toast.success(result?.message || "Subscribed successfully", {
        id: toastId,
        duration: 3500,
        style: {
          ...baseToastStyle,
          background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
        },
        iconTheme: {
          primary: "#6ee7b7",
          secondary: "#065f46",
        },
      });

      setEmail("");

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
        duration: 3500,
        style: {
          ...baseToastStyle,
          background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
        },
        iconTheme: {
          primary: "#fca5a5",
          secondary: "#7f1d1d",
        },
      });

      return {
        success: false,
        error,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    handleSubscribe,
  };
};

export default useNewsletterSubscribe;