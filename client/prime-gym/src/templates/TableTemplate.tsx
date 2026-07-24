import React from "react";
import Header from "../components/Header";
import Tables from "../components/Tables";

interface DataTables {
  header: string;
  subheader: string;
  Data: any[];
  Columns: any[];
  Url: string;
  additionalFunctionality?: (row_id: string) => void;
  onRowClick?: (row: any) => void;
  disableFetch?: boolean;
}

export default function TableTemplate({ header, subheader, Data, Url, Columns, additionalFunctionality, onRowClick, disableFetch }: DataTables): React.ReactElement {
  return (
    <div className="bg-white p-16 flex flex-col gap-3 rounded-lg">
      <Header subheader={subheader} header={header} />
      <Tables data={Data} url={Url} columns={Columns} additionalFunctionality={additionalFunctionality} onRowClick={onRowClick} disableFetch={disableFetch} />
    </div>
  );
}
