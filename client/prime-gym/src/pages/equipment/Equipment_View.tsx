import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Pills from "../../components/Pills";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import updateData from "../../data/updateData";
import EditEquipmentModal, {
  type EditEquipmentFormData,
} from "../../components/EditEquipmentModal";

type FormData = EditEquipmentFormData;

export default function Equipment_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "equipment/show/" });
  const { alertInfo, setAlertInfo } = useCrudAlert();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<FormData | null>(null);
  const editModalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      _id: "",
      equipment_name: "",
      equipment_status: "",
    },
  });

  const onEditRow = (row: any) => {
    setSelectedRow(row);
    editModalRef.current?.showModal();
  };

  useEffect(() => {
    if (selectedRow) {
      reset({
        _id: selectedRow._id,
        equipment_name: selectedRow.equipment_name || "",
        equipment_status: selectedRow.equipment_status || "",
      });
    }
  }, [selectedRow, reset]);

  const onSubmit = async (formData: FormData) => {
    await updateData({
      url: "equipment",
      id: formData._id,
      updateData: {
        equipment_name: formData.equipment_name,
        equipment_status: formData.equipment_status,
      },
    });

    editModalRef.current?.close();

    sessionStorage.setItem(
      "crudAlert",
      JSON.stringify({ message: "Equipment updated successfully!", variant: "success" })
    );
    navigate(0);
  };

  const columns = [
    {
      header: "#",
      cell: ({ row, table }: any) => {
        const page = table.options.meta?.page ?? 1;
        const limit = table.options.meta?.limit ?? 10;
        return (page - 1) * limit + row.index + 1;
      },
    },
    {
      header: "Equipment Name",
      accessorKey: "equipment_name",
    },
    {
      header: "Status",
      accessorKey: "equipment_status",
      cell: ({ row }: any) => <Pills status={row.original.equipment_status} />,
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
    {
      header: "Date Updated",
      accessorKey: "updatedAt",
      cell: ({ getValue }: any) => formatIsoDate(getValue()),
    },
  ];

  return (
    <div className="flex background-white h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      {alertInfo && (
        <Alert
          message={alertInfo.message}
          variant={alertInfo.variant}
          onClose={() => setAlertInfo(null)}
        />
      )}

      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <EditEquipmentModal
        ref={editModalRef}
        formKey={selectedRow?._id}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        onClose={() => editModalRef.current?.close()}
      />

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <CRUDTemplate
          header="Equipment Management"
          Columns={columns}
          Data={retrieveData}
          url="equipment"
          onEditRow={onEditRow}
          DeleteType="Hard Delete"
          RedirectAddUrl="/add_equipment"
          ButtonString="Add Equipment"
          subheader="Manage and track all your gym equipment here."
        />
      </div>
    </div>
  );
}
