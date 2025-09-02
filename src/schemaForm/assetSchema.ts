import * as yup from "yup";
import { isCodeUnique } from "../utils/assetUtils";
import { Asset } from "../model/Asset";

export const assetSchema = (assets: Asset[], previousCode?: string) =>
  yup.object({
    code: yup
      .string()
      .required("Code is a required field.")
      .test({
        message: "This asset code already exists.",
        test: (value: string | undefined) =>
          previousCode ? isCodeUnique(assets, previousCode, value) : true,
      }),
    contact: yup.object({
      email: yup
        .string()
        .required("Email is a required field.")
        .email("Email is not valid."),
      phone: yup.string().required("Phone number is required."),
    }),
  });
