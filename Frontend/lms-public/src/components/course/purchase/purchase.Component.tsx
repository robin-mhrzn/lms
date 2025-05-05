"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Elements } from "@stripe/react-stripe-js";
import { OrderService } from "@/services/orderService/orderService";
import CheckoutComponent from "../checkOut/checkout.Component";
import { loadStripe } from "@stripe/stripe-js";
import { AuthHelper } from "@/util/authHelper";
import { AuthUserModel } from "@/util/types/authModel";
import { showMessage } from "@/util/sharedHelper";
import { useRouter } from "next/navigation";
import { NavigationRoute } from "@/util/navigation";

interface PurchaseComponentProps {
  courseId: number;
  courseTitle: string;
  price: number;
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
const PurchaseComponent: React.FC<PurchaseComponentProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPurchase, setIsPurchase] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUserModel>(new AuthUserModel());
  const orderService = new OrderService();
  const authHelper = new AuthHelper();
  const router = useRouter();
  useEffect(() => {
    const userModel = authHelper.getAuthUser();
    if (userModel && userModel.email) {
      setAuthUser(userModel);
      orderService.isCoursePurchased(props.courseId).then((res) => {
        setIsPurchase(res);
      });
    }
  }, [props.courseId]);
  const handleOnSetPurchase = (isPurchased: boolean) => {
    setIsPurchase(isPurchased);
    setIsOpen(false);
  };
  const handlePurchase = () => {
    if (authUser && authUser.email) {
      setIsOpen(true);
    } else {
      showMessage(false, "Please login to purchase this course");
      const redirectUrl = encodeURIComponent(window.location.href);
      setTimeout(() => {
        router.push(`${NavigationRoute.LOGIN}?redirect=${redirectUrl}`);
      }, 2000);
    }
  };
  return (
    <>
      {!isPurchase ? (
        <Button className="w-full mb-4" onClick={handlePurchase}>
          Purchase this course
        </Button>
      ) : (
        <div className="text-center text-green-600 font-medium">
          You have already purchased this course
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Payment Details</DialogTitle>
            <p className="text-sm text-gray-600">
              You are purchasing <strong>{props.courseTitle}</strong> for
              <strong>${props.price.toFixed(2)}</strong>.
            </p>
          </DialogHeader>
          <Elements stripe={stripePromise}>
            <CheckoutComponent
              {...props}
              handleOnSetPurchase={handleOnSetPurchase}
            />
          </Elements>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PurchaseComponent;
