import React, { useMemo, useRef, useState } from "react";
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
import fetchRecord from "../../data/fetchRecord";
import EditSalesModal, {
  type EditSalesFormData,
} from "../../components/EditSalesModal";

type FormData = EditSalesFormData;

export default function Sales_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "sales/show/" });
  const { alertInfo, setAlertInfo } = useCrudAlert();
  const navigate = useNavigate();
  const [originalQuantity, setOriginalQuantity] = useState(0);
  const [currentSaleItem, setCurrentSaleItem] = useState<any>(null);
  const editModalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      _id: "",
      inventory_id: "",
      quantity: 1,
      is_active: "true",
    },
  });

  const forSaleItems = useFetchData({ url: "inventory/for-sale" });
  const baseItemList = Array.isArray(forSaleItems) ? forSaleItems : [];

  const itemList = useMemo(() => {
    if (!currentSaleItem) return baseItemList;
    const exists = baseItemList.some((item: any) => item._id === currentSaleItem._id);
    return exists ? baseItemList : [...baseItemList, currentSaleItem];
  }, [baseItemList, currentSaleItem]);

  const onEditRow = async (row: any) => {
    setOriginalQuantity(row.quantity);
    setCurrentSaleItem(null);
    reset({
      _id: row._id,
      inventory_id: row.inventory_id,
      quantity: row.quantity,
      is_active: row.is_active ? "true" : "false",
    });

    if (row.inventory_id) {
      try {
        const inventoryItem = await fetchRecord({ url: "inventory", id: row.inventory_id });
        if (inventoryItem) setCurrentSaleItem(inventoryItem);
      } catch (error) {
        console.error(error);
      }
    }

    editModalRef.current?.showModal();
  };

  const onSubmit = async (formData: FormData) => {
    try {
      const result = await updateData({
        url: "sales",
        id: formData._id,
        updateData: {
          inventory_id: formData.inventory_id,
          quantity: formData.quantity,
          is_active: formData.is_active === "true",
        },
      });

      if (result) {
        editModalRef.current?.close();
        sessionStorage.setItem(
          "crudAlert",
          JSON.stringify({ message: "Sale updated successfully!", variant: "success" })
        );
        navigate(0);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Failed to update sale.";
      alert(message);
    }
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
      header: "Customer",
      accessorFn: (row: any) => `${row.first_name ?? "N/A"} ${row.last_name ?? ""}`.trim(),
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
      header: "Qty Sold",
      accessorKey: "quantity",
    },
    {
      header: "Total Price",
      accessorKey: "total_price",
      cell: ({ row }: any) =>
        `₱${Number(row.original.total_price).toLocaleString("en-PH", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row }: any) => (
        <Pills status={row.original.is_active ? "Active" : "Inactive"} />
      ),
    },
    {
      header: "Date Sold",
      accessorKey: "createdAt",
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

      <EditSalesModal
        ref={editModalRef}
        register={register}
        handleSubmit={handleSubmit}
        control={control}
        errors={errors}
        itemList={itemList}
        originalQuantity={originalQuantity}
        onSubmit={onSubmit}
        onClose={() => editModalRef.current?.close()}
      />

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <CRUDTemplate
          header="Sales Management"
          Columns={columns}
          Data={retrieveData}
          url="sales"
          onEditRow={onEditRow}
          DeleteType="Hard Delete"
          RedirectAddUrl="/add_sales"
          ButtonString="New Sale"
          subheader="Track and manage all inventory sales."
        />
      </div>
    </div>
  );
}
