import { PageFooter } from "@/components/DevicesPage/PageFooter";
import { PageHeader } from "@/components/DevicesPage/PageHeader";
import { PageContent } from "@/components/PageContent";

export default function RelationsPage() {
  // footer stays the same - we pass props

  const relations = [
    {
      username: "acx12",
      serial_number: "786821hbc",
    },
    {
      username: "acx11",
      serial_number: "711121hbc",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader />
      <PageContent type="relations" data={relations} />
      <PageFooter />
    </div>
  );
}
