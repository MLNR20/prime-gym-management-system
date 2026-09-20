import React from "react";
import Header from "../components/Header";
import HeaderMd from "../components/HeadersMd";
import Tables from "../components/Tables";

interface DataTables {
  header: string;
  subheader: string;
  Data: any[];
  Columns: any[];
  Url: string;
  additionalFunctionality?: (row_id: string) => void;
  onApprove?: (row_id: string) => void;
  onReject?: (row_id: string) => void;
  onRenew?: (row_id: string) => void;
  onRowClick?: (row: any) => void;
  disableFetch?: boolean;
  isUserDetailsView?: boolean;
  customerId?: string;
}

export default function TableTemplate({ header, subheader, Data, Url, Columns, additionalFunctionality, onApprove, onReject, onRenew, onRowClick, disableFetch, isUserDetailsView, customerId }: DataTables): React.ReactElement {
  if (isUserDetailsView) {
    return (
      <div className="flex flex-col gap-3">
        <HeaderMd header={header} subheader={subheader} />
        <div className="mt-6">
          <Tables data={Data} url={Url} columns={Columns} additionalFunctionality={additionalFunctionality} onApprove={onApprove} onReject={onReject} onRenew={onRenew} onRowClick={onRowClick} disableFetch={disableFetch} customerId={customerId} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-12 sm:p-16 lg:p-16 flex flex-col gap-3 rounded-lg w-full overflow-hidden">
      <Header subheader={subheader} header={header} />
      <div className="mt-6">
        <Tables data={Data} url={Url} columns={Columns} additionalFunctionality={additionalFunctionality} onApprove={onApprove} onReject={onReject} onRenew={onRenew} onRowClick={onRowClick} disableFetch={disableFetch} customerId={customerId} />
      </div>
    </div>
  );
}
