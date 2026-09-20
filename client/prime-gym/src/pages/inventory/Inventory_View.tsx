import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Pills from "../../components/Pills";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import updateData from "../../data/updateData";
import EditInventoryModal, {
  type EditInventoryFormData,
} from "../../components/EditInventoryModal";

type FormData = EditInventoryFormData;

export default function Inventory_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "inventory/show/" });
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
      item_name: "",
      item_code: "",
      category: "",
      quantity: 0,
      unit_price: 0,
      status: "Available",
      is_for_sale: "false",
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
        item_name: selectedRow.item_name || "",
        item_code: selectedRow.item_code || "",
        category: selectedRow.category || "",
        quantity: Number(selectedRow.quantity) || 0,
        unit_price: Number(selectedRow.unit_price) || 0,
        status: selectedRow.status || "Available",
        is_for_sale: (selectedRow as any).is_for_sale ? "true" : "false",
      });
    }
  }, [selectedRow, reset]);

  const onSubmit = async (formData: FormData) => {
    await updateData({
      url: "inventory",
      id: formData._id,
      updateData: {
        item_name: formData.item_name,
        item_code: formData.item_code,
        category: formData.category,
        quantity: formData.quantity,
        unit_price: formData.unit_price,
        status: formData.status,
        is_for_sale: formData.is_for_sale === "true",
      },
    });

    editModalRef.current?.close();

    sessionStorage.setItem(
      "crudAlert",
      JSON.stringify({ message: "Inventory item updated successfully!", variant: "success" })
    );
    navigate(0);
  };

  const columns = [
    {
      header: "#",
      cell: ({ row, table }: any) => {
        const { page = 1, limit = 10 } = table.options.meta ?? {};
        return (page - 1) * limit + row.index + 1;
      },
    },
    {
      header: "Item Code",
      accessorKey: "item_code",
    },
    {
      header: "Item Name",
      accessorKey: "item_name",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Qty",
      accessorKey: "quantity",
    },
    {
      header: "Unit Price",
      accessorKey: "unit_price",
      cell: ({ row }: any) =>
        `₱${Number(row.original.unit_price).toLocaleString("en-PH", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => <Pills status={row.original.status} />,
    },
    {
      header: "For Sale",
      accessorKey: "is_for_sale",
      cell: ({ row }: any) => <Pills status={row.original.is_for_sale ? "Yes" : "No"} />,
    },
    {
      header: "Date Added",
      accessorKey: "createdAt",
      cell: ({ row }: any) =>
        new Date(row.original.createdAt).toLocaleDateString(),
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

      <EditInventoryModal
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
          header="Inventory Management"
          Columns={columns}
          Data={retrieveData}
          url="inventory"
          onEditRow={onEditRow}
          DeleteType="Hard Delete"
          RedirectAddUrl="/add_inventory"
          ButtonString="Add Item"
          subheader="Track and manage all gym inventory items."
        />
      </div>
    </div>
  );
}
