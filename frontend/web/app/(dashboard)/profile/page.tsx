"use client";

import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import useAuth from "@/hooks/useAuth";
import { useUpdateUserMutation } from "@/store/api/userApi";
import { getErrorMessage } from "@/utils/error";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GoPencil } from "react-icons/go";

type ProfileFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  password: string;
};

const ProfilePage = () => {
  const { user } = useAuth();
  const fullName = user?.fullName.split(" ");
  const firstNameLetter = fullName?.at(0)?.charAt(0);
  const lastNameLetter = fullName?.at(1)?.charAt(0);
  const [isEdit, setIsEdit] = useState(false);
  const {
    register,
    handleSubmit,
    setValues,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      department: user?.department ?? "",
    },
    mode: "onChange",
  });

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const userInformations: {
    key?: keyof ProfileFormValues;
    label: string;
    value?: string | null;
  }[] = [
    {
      key: "fullName",
      label: "Ad Soyad",
      value: user?.fullName,
    },

    {
      key: "email",
      label: "E-posta",
      value: user?.email,
    },

    {
      key: "phoneNumber",
      label: "Telefon",
      value: user?.phoneNumber,
    },

    {
      key: "department",
      label: "Departman",
      value: user?.department,
    },

    {
      key: "password",
      label: "Şifre",
      value: null,
    },

    {
      label: "Rol",
      value: user?.role,
    },

    {
      label: "Hesap Durumu",
      value: user?.status,
    },
  ];

  const handleUpdateProfile: SubmitHandler<ProfileFormValues> = async (
    values,
  ) => {
    if (!user) return;

    try {
      const updateProfileResponse = await updateProfile({
        userId: user.id,
        body: values,
      }).unwrap();

      if (updateProfileResponse.success) {
        setIsEdit(false);
        toast.success("Profil başarıyla güncellendi");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card text-card-foreground w-full shadow-none">
        <div className="p-6 flex gap-y-2 flex-wrap items-center justify-between">
          <div className="flex flex-wrap flex-row items-center gap-x-4 gap-y-2">
            <div className="flex size-14 items-center justify-center rounded-md bg-accent font-display text-lg font-bold text-accent-foreground">
              {`${firstNameLetter} ${lastNameLetter}`}
            </div>

            <div>
              <strong className="font-bold tracking-tight text-base">
                {user?.fullName}
              </strong>

              <p className="text-sm text-muted-foreground">
                {user?.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
              {user?.role}
            </div>

            {!isEdit && (
              <CustomButton
                className="hover:text-accent-foreground! hover:bg-accent! bg-background! text-foreground! border border-border h-8! text-xs font-bold! py-0! px-3!"
                handleClick={() => {
                  setIsEdit(true);
                  setValues({
                    department: user?.department,
                    email: user?.email,
                    fullName: user?.fullName,
                    phoneNumber: user?.phoneNumber,
                  });
                }}
              >
                <GoPencil size={16} />
                Düzenle
              </CustomButton>
            )}
          </div>
        </div>

        <div className="p-6 pt-0">
          {userInformations.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm font-medium text-muted-foreground">
                {item.label}
              </span>

              {isEdit && item.key ? (
                <CustomInput
                  key={item.key}
                  placeholder={item.key === "password" ? "••••••••" : ""}
                  {...register(item.key, {
                    required: {
                      value: item.key === "password" ? false : true,
                      message: `${item.label} zorunlu`,
                    },
                    ...(item.key === "email"
                      ? {
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Geçerli bir e-posta adresi girin",
                          },
                        }
                      : item.key === "phoneNumber"
                        ? {
                            pattern: {
                              value: /^0\d{3} \d{3} \d{2} \d{2}$/,
                              message:
                                "Telefon numarası 0555 555 55 55 formatında olmalı",
                            },
                          }
                        : item.key === "fullName"
                          ? {
                              pattern: {
                                value:
                                  /^[A-Za-zÇĞİÖŞÜçğıöşü]+(?: [A-Za-zÇĞİÖŞÜçğıöşü]+)+$/,
                                message: "Ad ve soyad girilmelidir",
                              },
                            }
                          : {}),
                  })}
                  error={errors[item.key]?.message}
                />
              ) : (
                <span className="text-sm font-semibold">{item.value}</span>
              )}
            </div>
          ))}

          {isEdit && (
            <div className="flex justify-end gap-2 pt-5">
              <CustomButton
                text="İptal Et"
                className="w-max hover:text-accent-foreground! hover:bg-accent! border border-border text-foreground! bg-background! font-semibold!"
                handleClick={() => setIsEdit(false)}
              />
              <CustomButton
                text="Kaydet"
                className="w-max font-semibold!"
                isSubmitting={isLoading}
                handleClick={handleSubmit(handleUpdateProfile)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
