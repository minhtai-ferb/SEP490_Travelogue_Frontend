import BreadcrumbHeader from "@/components/common/breadcrumb-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Metadata } from "next";
import Datatable from "./component/datatable";

function ReportTable() {
  return (
    <div>
      <Datatable />
    </div>
  );
}

export default ReportTable;
