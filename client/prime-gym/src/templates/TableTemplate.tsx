import React from "react";
import HeaderMd from "../components/Header";
import Tables from "../components/Tables";

interface DataTables{
    header: string;
    subheader: string;
    Data: any[];
    Columns: any[];

}

export default function TableTemplate({header, subheader, Data, Columns}: DataTables): React.ReactElement {
  return (
    <div className="bg-white p-16 rounded-lg">
      <HeaderMd subheader={subheader} header={header} />
      <Tables data={Data} columns={Columns}/>
    </div>
  );
}
