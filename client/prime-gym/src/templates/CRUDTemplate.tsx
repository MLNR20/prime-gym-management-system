import React from "react";
import Header from "../components/Header";
import CRUDTables from "../components/CRUD_Tables";
import { Link } from "react-router-dom"

interface DataTables {
  header: string;
  subheader: string;
  additionalFunctionality?: (row?: any) => void;
  onEditRow?: (row: any) => void;
  Data: any[];
  url: string;
  Columns: any[];
  ButtonString: string;
  ButtonAdditionalString?: string;
  DeleteType: string;
  RedirectAddUrl: string;
}

export default function CRUDTemplate({ header, ButtonAdditionalString, subheader, url, Data, additionalFunctionality, onEditRow, RedirectAddUrl, DeleteType, Columns, ButtonString }: DataTables): React.ReactElement {
  return (
    <div className="bg-white p-12 sm:p-16 lg:p-16 gap-3 flex flex-col rounded-lg w-full overflow-hidden">
      <Header subheader={subheader} header={header} />
      <Link to={RedirectAddUrl}><button className="btn btn-success mb-4 mt-4 text-white">{ButtonString}</button></Link>
      <CRUDTables data={Data} url={url} buttonString={ButtonAdditionalString} additionalFunctionality={additionalFunctionality} onEditRow={onEditRow} deleteType={DeleteType} columns={Columns} />
    </div>
  );
}
