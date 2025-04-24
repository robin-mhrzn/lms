"use client";
import MainContainer from "@/components/layout/admin/mainContainer";
import {
  IPurchaseCourseItem,
  OrderService,
} from "@/services/orderService/orderService";
import { PaginationModel } from "@/util/types/paginationModel";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const MyPurchase = () => {
  const orderService = new OrderService();
  const [purchaseItem, setPurchaseItem] =
    useState<PaginationModel<IPurchaseCourseItem>>();
  const [loading, setLoading] = useState(true);
  const [requestPaginationItem, setRequestPaginationItem] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchPurchasedCourses();
  }, [requestPaginationItem.currentPage]);

  const fetchPurchasedCourses = async () => {
    setLoading(true);
    const response = await orderService.purchasedCourses(
      requestPaginationItem.currentPage,
      requestPaginationItem.pageSize
    );
    setPurchaseItem(response);
    setLoading(false);
  };

  const handleNextPage = () => {
    if (
      purchaseItem &&
      requestPaginationItem.currentPage <
        Math.ceil(purchaseItem.totalRecord / requestPaginationItem.pageSize)
    ) {
      setRequestPaginationItem((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }
  };

  const handlePreviousPage = () => {
    if (requestPaginationItem.currentPage > 1) {
      setRequestPaginationItem((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
    }
  };

  return (
    <MainContainer
      title="My Purchase"
      content="View your purchased course list."
    >
      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : purchaseItem?.data && purchaseItem.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchaseItem.data.map((item) => (
                <Card
                  key={item.courseId}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <img
                      src={item.thumbnailImageUrl}
                      alt={item.courseName}
                      className="w-full h-40 object-cover rounded-t-md"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg font-semibold">
                      {item.courseName}
                    </CardTitle>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={handlePreviousPage}
                disabled={requestPaginationItem.currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <p className="text-gray-500">
                Page {requestPaginationItem.currentPage} of{" "}
                {Math.ceil(
                  purchaseItem.totalRecord / requestPaginationItem.pageSize
                )}
              </p>
              <Button
                onClick={handleNextPage}
                disabled={
                  requestPaginationItem.currentPage >=
                  Math.ceil(
                    purchaseItem.totalRecord / requestPaginationItem.pageSize
                  )
                }
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No purchased courses found.</p>
          </div>
        )}
      </div>
    </MainContainer>
  );
};

export default MyPurchase;
