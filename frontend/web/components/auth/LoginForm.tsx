"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import CustomButton from "../ui/CustomButton";
import CustomInput from "../ui/CustomInput";
import { useLoginMutation } from "@/store/api/authApi";
import { LoginRequest } from "@/types/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { baseApi } from "@/store/api/baseApi";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<LoginRequest> = async (values) => {
    try {
      const loginResponse = await login(values).unwrap();

      if (loginResponse.success) {
        dispatch(baseApi.util.resetApiState());
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div>
          <h1 className="text-2xl font-bold">Giriş Yap</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Yöneticiniz tarafından oluşturulan kurumsal hesabı kullanın.
          </p>
        </div>

        <form
          className="mt-8 space-y-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CustomInput
            id="email"
            label="E-posta"
            placeholder="ornek@gmail.com"
            error={errors.email?.message}
            {...register("email", { required: "e-posta zorunlu" })}
          />

          <CustomInput
            type="password"
            id="password"
            label="Şifre"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", { required: "şifre zorunlu" })}
          />

          <CustomButton
            type="submit"
            text="Giriş Yap"
            isSubmitting={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
