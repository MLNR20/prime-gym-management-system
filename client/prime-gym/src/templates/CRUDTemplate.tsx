import React from "react";
import Header from "../components/Header";
import CRUDTables from "../components/CRUD_Tables";


interface DataTables{
    header: string;
    subheader: string;
    Data: any[];
    url: string;
    Columns: any[];
    ButtonString: string;
}

export default function CRUDTemplate({header, subheader, url, Data, Columns, ButtonString}: DataTables): React.ReactElement {
  return (
    <div className="bg-white p-12 rounded-lg">
      <Header subheader={subheader} header={header} />
      <button className="btn btn-success mb-4 mt-4 text-white">{ButtonString}</button>
      <CRUDTables data={Data} url={url} columns={Columns}/>
    </div>
  );
}
