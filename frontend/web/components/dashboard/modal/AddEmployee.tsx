import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { useCreateUserMutation } from "@/store/api/userApi";
import { UserRole } from "@/types/user";
import { getErrorMessage } from "@/utils/error";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";

const formValues = {
  name: "",
  surname: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: "",
  department: "",
};

const AddEmployee = ({
  setIsShowModal,
}: {
  setIsShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    formState: { errors },
    setFocus,
    handleSubmit,
  } = useForm({
    defaultValues: formValues,
  });
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleCloseModal = () => setIsShowModal(false);

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit: SubmitHandler<typeof formValues> = async (values) => {
    const fullName = `${values.name} ${values.surname}`;
    const employeeRole =
      values.role === "ADMIN" ? UserRole.ADMIN : UserRole.EMPLOYEE;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, name, surname, ...rest } = values;

    const payload = {
      fullName,
      role: employeeRole,
      ...rest,
    };

    try {
      const createUserResponse = await createUser(payload).unwrap();

      if (createUserResponse.success) handleCloseModal();
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
            Çalışan hesabı oluştur
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Çalışan, burada oluşturduğunuz kimlik bilgileriyle oturum açar.
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
              label="Adı"
              {...register("name", { required: "çalışan adı zorunlu" })}
              error={errors.name?.message}
            />

            <CustomInput
              label="Soyadı"
              {...register("surname", { required: "çalışan soyadı zorunlu" })}
              error={errors.surname?.message}
            />

            <CustomInput
              label="E-posta"
              {...register("email", {
                required: "e-posta zorunlu",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Geçerli bir e-posta adresi girin",
                },
              })}
              error={errors.email?.message}
            />

            <CustomInput
              label="Şifre"
              {...register("password", {
                required: "şifre zorunlu",
              })}
              error={errors.password?.message}
            />

            <CustomInput
              label="Telefon Numarası"
              {...register("phoneNumber", {
                required: "Telefon numarası zorunlu",
                pattern: {
                  value: /^0\d{3} \d{3} \d{2} \d{2}$/,
                  message: "Telefon numarası 0555 555 55 55 formatında olmalı",
                },
              })}
              error={errors.phoneNumber?.message}
            />

            <CustomInput
              label="Departman"
              {...register("department", { required: "departman zorunlu" })}
              error={errors.department?.message}
            />

            <CustomSelect
              label="Rol"
              options={[
                {
                  value: "ADMIN",
                  label: "Admin",
                },
                {
                  value: "EMPLOYEE",
                  label: "Çalışan",
                },
              ]}
              {...register("role", {
                required: "Rol zorunlu",
              })}
              error={errors.role?.message}
            />
          </div>

          <div className="flex gap-y-2 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
            <CustomButton
              text="İptal Et"
              className="sm:w-max bg-background! text-foreground! border border-input hover:bg-accent! hover:text-accent-foreground!"
              handleClick={handleCloseModal}
            />
            <CustomButton
              text="Hesap Oluştur"
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

export default AddEmployee;
