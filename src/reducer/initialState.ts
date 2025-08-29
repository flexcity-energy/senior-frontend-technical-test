import { Asset } from "../model/Asset";

// Initial state data
export const initialState = {
  assets: [
    {
      code: "PLANT_SDO23SBK",
      activationOffset: "PT5M",
      contact: { email: "gaetan.dupere@mail.com", phoneNumber: "0247563181" },
    },
    {
      code: "HOUSE_P52DEZ",
      activationOffset: "PT1H",
      contact: {
        email: "laetitia.rossignol@mail.com",
        phoneNumber: "0678651265",
      },
    },
    {
      code: "HOUSE_FZ27LQD",
      activationOffset: "PT5M",
      contact: { email: "andre.vincent@mail.com", phoneNumber: "0954893215" },
    },
    {
      code: "PLANT_ERS57NK",
      activationOffset: "PT15M",
      contact: { email: "david.busque@mail.com", phoneNumber: "0286471258" },
    },
    {
      code: "HOUSE_JAC68LEN",
      activationOffset: "PT10M",
      contact: { email: "luc.lavallee@mail.com", phoneNumber: "0624873596" },
    },
    {
      code: "PLANT_JKL45STD",
      activationOffset: "PT30M",
      contact: { email: "romain.lejeune@mail.com", phoneNumber: "0245637854" },
    },
    {
      code: "PLANT_ZAS24WQP",
      activationOffset: "PT5M",
      contact: { email: "agnes.bussiere@mail.com", phoneNumber: "0954268751" },
    },
    {
      code: "HOUSE_KSJ67APV",
      activationOffset: "PT10M",
      contact: { email: "elodie.labrie@mail.com", phoneNumber: "0278653491" },
    },
    {
      code: "PLANT_YTC46LZX",
      activationOffset: "PT5M",
      contact: { email: "thomas.lacasse@mail.com", phoneNumber: "0678459275" },
    },
  ] as Asset[],
  selectedAsset: {} as Asset,
};
