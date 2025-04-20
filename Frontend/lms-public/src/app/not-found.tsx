import NotFoundComponent from "@/components/extras/notFound";
import MainContainer from "@/components/publicLayout/mainContainer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <MainContainer>
      <NotFoundComponent></NotFoundComponent>
    </MainContainer>
  );
}
