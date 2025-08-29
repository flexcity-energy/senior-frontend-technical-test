import * as yup from "yup";
import { isCodeUnique } from "../utils/assetUtils";
import { Asset } from "../model/Asset";

// Simple regex for phone number validation (only french numbers)
const phoneRegExp = /^0[1-9]\d{8}$/;

/**
 * Get asset form schema
 * @param assets
 * @param previousCode
 * @returns form schema
 */
export const assetSchema = (assets: Asset[], previousCode: string) =>
  yup.object({
    code: yup
      .string()
      .required("Code is a required field.")
      .test({
        message: "This asset code already exists.",
        test: (value: string | undefined) =>
          isCodeUnique(assets, previousCode, value),
      }),
    activationOffset: yup
      .number()
      .typeError("Activation offset must be a number.")
      .required("Activation offset is a required field.")
      .max(120, "Activation offset must be less than or equal to 120."),
    contact: yup.object({
      email: yup
        .string()
        .required("Email is a required field.")
        .email("Email is not valid."),
      phoneNumber: yup
        .string()
        .required("Phone number is required.")
        .matches(phoneRegExp, "Phone number is not valid."),
    }),
  });
