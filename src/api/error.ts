import { AxiosError } from "axios";

type AppError = {
  message: string;
};

export const mapError = (err: unknown): AppError => {
  const axiosError = err as AxiosError<{ message: string }>;

  return {
    message: axiosError.response?.data?.message || "Something went wrong",
  };
};
