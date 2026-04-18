import React from "react";
import HeaderMd from "../components/HeadersMd";
import Tables from "../components/Tables";

interface DataTables{
    header: string;
    subheader: string;
    Data: any[];
    Columns: any[];
    Url: string;

}

export default function TableTemplate({header, subheader, Data, Url, Columns}: DataTables): React.ReactElement {
  return (
    <div className="bg-white p-16 rounded-lg">
      <HeaderMd subheader={subheader} header={header} />
      <Tables data={Data} url={Url} columns={Columns}/>
    </div>
  );
}
