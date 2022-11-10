import axios from "axios";
import { useDeployProject } from "hooks/useCreateProject";
import { PinMetadataRequestPayload } from "pages/api/pin-metadata";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";

export interface CreateFormInputs {
  goal: string;
  returnWindowDays: string;
  supervisor: string;
  stakeAmount: string;
  unreturnedStakeBeneficiary: string;
}

export interface CreateProjectData {
  returnWindowDays: string;
  supervisor: string;
  stakeAmount: string;
  unreturnedStakeBeneficiary: string;
  metadataURI: string;
}

const CreateForm = () => {
  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = useForm<CreateFormInputs>();

  const [metadataUri, setMetadataUri] = useState<string>("");

  const deployData: CreateProjectData = {
    returnWindowDays: watch("returnWindowDays"),
    supervisor: watch("supervisor"),
    stakeAmount: watch("stakeAmount"),
    unreturnedStakeBeneficiary: watch("unreturnedStakeBeneficiary"),
    metadataURI: metadataUri,
  };

  const { write } = useDeployProject(deployData);

  const uploadMetadata = async () => {
    const data: PinMetadataRequestPayload = {
      name: getValues("goal"),
      description: "This project was created with victory.money",
      imageCid: "",
    };
    const res = await axios.post("/api/pin-metadata", data);
    setMetadataUri(`ipfs://${res.data.cid}`);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    uploadMetadata();
    e.preventDefault();
    write?.();
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label htmlFor="goal">Goal</label>
      <input type="text" id="goal" {...register("goal", { required: true })} />
      {errors.goal && <p>Goal is required</p>}
      <label htmlFor="returnWindowDays">Return Window Days</label>
      <input
        type="text"
        id="returnWindowDays"
        {...register("returnWindowDays", { required: true })}
      />
      {errors.returnWindowDays && <p>Return Window Days is required</p>}
      <label htmlFor="supervisorAddress">Supervisor Address</label>
      <input
        type="text"
        id="supervisorAddress"
        {...register("supervisor", {
          required: true,
        })}
      />
      {errors.supervisor && <p>Supervisor Address is required</p>}
      <label htmlFor="stakeAmount">Stake Amount</label>
      <input
        type="text"
        id="stakeAmount"
        {...register("stakeAmount", { required: true })}
      />
      {errors.stakeAmount && <p>Stake Amount is required</p>}
      <label htmlFor="unreturnedStakeBeneficiary">
        Unreturned Stake Beneficiary
      </label>
      <input
        type="text"
        id="unreturnedStakeBeneficiary"
        {...register("unreturnedStakeBeneficiary", {
          required: true,
        })}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateForm;
