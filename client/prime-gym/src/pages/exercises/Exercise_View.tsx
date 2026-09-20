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
import EditExerciseModal, {
  type EditExerciseFormData,
} from "../../components/EditExerciseModal";

type FormData = EditExerciseFormData;

export default function Exercise_View(): React.ReactElement {
  const retrieveData = useFetchData({ url: "exercises" });
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
      exercise_name: "",
      target_area: "",
      reps: 1,
      sets: 1,
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
        exercise_name: selectedRow.exercise_name || "",
        target_area: selectedRow.target_area || "",
        reps: Number(selectedRow.reps) || 1,
        sets: Number(selectedRow.sets) || 1,
      });
    }
  }, [selectedRow, reset]);

  const onSubmit = async (formData: FormData) => {
    await updateData({
      url: "exercises",
      id: formData._id,
      updateData: {
        exercise_name: formData.exercise_name,
        target_area: formData.target_area,
        reps: formData.reps,
        sets: formData.sets,
      },
    });

    editModalRef.current?.close();

    sessionStorage.setItem(
      "crudAlert",
      JSON.stringify({ message: "Exercise updated successfully!", variant: "success" })
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
      header: "Exercise Name",
      accessorKey: "exercise_name",
    },
    {
      header: "Target Area",
      accessorKey: "target_area",
    },
    {
      header: "Reps",
      accessorKey: "reps",
    },
    {
      header: "Sets",
      accessorKey: "sets",
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

      <EditExerciseModal
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
          header="Exercise Management"
          Columns={columns}
          Data={retrieveData}
          url="exercises"
          onEditRow={onEditRow}
          DeleteType="Soft Delete"
          RedirectAddUrl="/add_exercise"
          ButtonString="Add Exercise"
          subheader="Let's manage your exercise library..."
        />
      </div>
    </div>
  );
}
