import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import CRUDTemplate from "../../templates/CRUDTemplate";
import useFetchData from "../../data/fetchData";
import formatIsoDate from "../../utils/dateFormat";
import Alert from "../../components/Alert";
import useCrudAlert from "../../utils/useCrudAlert";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import updateData from "../../data/updateData";
import EditExpenseModal, {
  type EditExpenseFormData,
} from "../../components/EditExpenseModal";

type FormData = EditExpenseFormData;

export default function Expense_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "expenses/show/" });
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
      expense_title: "",
      unit_price: 0,
      quantity: 0,
      categories: "",
      due_date: "",
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
        expense_title: selectedRow.expense_title || "",
        unit_price: Number(selectedRow.unit_price) || 0,
        quantity: Number(selectedRow.quantity) || 0,
        categories: selectedRow.categories || "",
        due_date: (selectedRow as any).due_date
          ? new Date((selectedRow as any).due_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [selectedRow, reset]);

  const onSubmit = async (formData: FormData) => {
    await updateData({
      url: "expenses",
      id: formData._id,
      updateData: {
        expense_title: formData.expense_title,
        categories: formData.categories,
        quantity: Number(formData.quantity),
        unit_price: Number(formData.unit_price),
        due_date: formData.due_date,
      },
    });

    editModalRef.current?.close();

    sessionStorage.setItem(
      "crudAlert",
      JSON.stringify({ message: "Expense updated successfully!", variant: "success" })
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
      header: "Expense Title",
      accessorKey: "expense_title",
    },
    {
      header: "Category",
      accessorKey: "categories",
    },
    {
      header: "Quantity",
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
      header: "Due Date",
      accessorKey: "due_date",
      cell: ({ getValue }: any) => (getValue() ? formatIsoDate(getValue()) : "—"),
    },
    {
      header: "Date Added",
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

      <EditExpenseModal
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
          header="Expenses Management"
          Columns={columns}
          Data={retrieveData}
          url="expenses"
          onEditRow={onEditRow}
          DeleteType="Hard Delete"
          RedirectAddUrl="/add_expense"
          ButtonString="Add Expense"
          subheader="Track and manage all gym-related expenses."
        />
      </div>
    </div>
  );
}
