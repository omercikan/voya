import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { useCreateVehicleMutation } from "@/store/api/vehicleApi";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import { getErrorMessage } from "@/utils/error";

type AddVehicleFormValues = {
  plate: string;
  km: number;
  brand: string;
  model: string;
  fuel: string;
  gear: string;
  location: string;
  year: number;
};

const formValues: AddVehicleFormValues = {
  plate: "",
  km: 0,
  brand: "",
  model: "",
  fuel: "",
  gear: "",
  location: "",
  year: 2026,
};

const AddVehicle = ({
  setIsShowModal,
}: {
  setIsShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    formState: { errors },
    setFocus,
    handleSubmit,
  } = useForm<AddVehicleFormValues>({
    defaultValues: formValues,
  });
  const [createVehicle, { isLoading }] = useCreateVehicleMutation();

  const handleCloseModal = () => setIsShowModal(false);

  useEffect(() => {
    setFocus("plate");
  }, [setFocus]);

  const onSubmit: SubmitHandler<AddVehicleFormValues> = async (values) => {
    try {
      const createVehicleResponse = await createVehicle(values).unwrap();

      if (createVehicleResponse) handleCloseModal();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80" onClick={handleCloseModal}>
      <div
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div>
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            Araç ekle
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Filoya yeni bir araç eklemek için bilgileri doldurun.
          </p>
        </div>

        <button
          onClick={handleCloseModal}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <IoIosClose size={24} />
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <CustomInput
              label="Plaka"
              {...register("plate", {
                required: "plaka zorunlu",
                pattern: {
                  value: /^[0-9]{2} [A-Za-zÇĞİÖŞÜçğıöşü]{1,3} [0-9]{2,4}$/,
                  message: "Geçerli bir plaka girin (örn. 34 ABC 123)",
                },
              })}
              error={errors.plate?.message}
            />

            <CustomInput
              label="Kilometre"
              {...register("km", {
                required: "kilometre zorunlu",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Kilometre sadece rakam olmalı",
                },
              })}
              error={errors.km?.message}
            />

            <CustomInput
              label="Marka"
              {...register("brand", { required: "marka zorunlu" })}
              error={errors.brand?.message}
            />

            <CustomInput
              label="Model"
              {...register("model", { required: "model zorunlu" })}
              error={errors.model?.message}
            />

            <CustomInput
              label="Yıl"
              {...register("year", { required: "yıl zorunlu" })}
              error={errors.year?.message}
            />

            <CustomSelect
              label="Yakıt Türü"
              options={[
                { value: "BENZIN", label: "Benzin" },
                { value: "DIZEL", label: "Dizel" },
                { value: "HIBRIT", label: "Hibrit" },
                { value: "ELEKTRIK", label: "Elektrik" },
                { value: "LPG", label: "LPG" },
              ]}
              {...register("fuel", { required: "yakıt türü zorunlu" })}
              error={errors.fuel?.message}
            />

            <CustomSelect
              label="Vites"
              options={[
                { value: "MANUEL", label: "Manuel" },
                { value: "OTOMATIK", label: "Otomatik" },
              ]}
              {...register("gear", { required: "vites zorunlu" })}
              error={errors.gear?.message}
            />

            <CustomInput
              label="Konum"
              {...register("location", { required: "konum zorunlu" })}
              error={errors.location?.message}
            />
          </div>

          <div className="flex gap-y-2 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
            <CustomButton
              text="İptal Et"
              className="sm:w-max bg-background! text-foreground! border border-input hover:bg-accent! hover:text-accent-foreground!"
              handleClick={handleCloseModal}
            />
            <CustomButton
              text="Araç Ekle"
              className="sm:w-max"
              isSubmitting={isLoading}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
