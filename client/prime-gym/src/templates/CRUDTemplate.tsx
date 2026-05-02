import React from "react";
import Header from "../components/Header";
import CRUDTables from "../components/CRUD_Tables";
import {Link} from "react-router-dom"

interface DataTables{
    header: string;
    subheader: string;
    additionalFunctionality?: (row?: any) => void;
    Data: any[];
    url: string;
    Columns: any[];
    ButtonString: string;
    RedirectAddUrl: string;
}

export default function CRUDTemplate({header, subheader, url, Data, additionalFunctionality, RedirectAddUrl, Columns, ButtonString}: DataTables): React.ReactElement {
  return (
    <div className="bg-white p-16 rounded-lg">
      <Header subheader={subheader} header={header} />
      <Link to={RedirectAddUrl}><button className="btn btn-success mb-4 mt-4 text-white">{ButtonString}</button></Link>
      <CRUDTables data={Data} url={url} additionalFunctionality={additionalFunctionality} columns={Columns}/>
    </div>
  );
}
