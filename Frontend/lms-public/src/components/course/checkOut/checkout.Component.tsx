"use client";
import { Button } from "@/components/ui/button";
import { OrderService } from "@/services/orderService/orderService";
import { showMessage } from "@/util/sharedHelper";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

interface CheckOutComponentProps {
  courseId: number;
  courseTitle: string;
  price: number;
  handleOnSetPurchase?: (isPurchased: boolean) => void;
}
const CheckoutComponent: React.FC<CheckOutComponentProps> = ({
  courseId,
  courseTitle,
  price,
  handleOnSetPurchase,
}) => {
  const orderService = new OrderService();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      setLoading(false);
      return;
    }
    const { token, error } = await stripe.createToken(
      elements.getElement(CardElement)!
    );

    if (error) {
      setError(error.message || "Failed to create card token.");
      setLoading(false);
      return;
    }
    if (token) {
      const response = await orderService.addOrder(courseId, price, token.id);
      if (response.success == true) {
        showMessage(true, "Course has been purchased successfully.");
        if (handleOnSetPurchase) {
          handleOnSetPurchase(true);
        }
      } else {
        showMessage(
          false,
          response?.success == false
            ? response.message
            : "Failed to purchase course. Please try again."
        );
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        className="p-3 border rounded-md"
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};
export default CheckoutComponent;
