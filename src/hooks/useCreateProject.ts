import { CreateProjectData } from "components/CreateForm";
import { contracts } from "constants/contracts";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

interface DeployPepperStakeData {
  supervisors: string[];
  stakeAmount: BigNumber;
  unreturnedStakeBeneficiaries: string[];
  returnWindowDays: number;
  maxParticipants: number;
  shouldParticipantsShareUnreturnedStake: boolean;
  shouldUseSupervisorInactionGuard: boolean;
  metadataURI: string;
}

export function useDeployProject(projectData: CreateProjectData) {
  const { pepperStakeDeployer } = contracts.goerli;

  const {
    returnWindowDays,
    supervisor,
    stakeAmount,
    unreturnedStakeBeneficiary,
    metadataURI,
  } = projectData;

  let deployData: DeployPepperStakeData = {
    supervisors: [supervisor],
    stakeAmount: parseEther("0"),
    unreturnedStakeBeneficiaries: [unreturnedStakeBeneficiary],
    returnWindowDays: 0,
    maxParticipants: 1,
    shouldParticipantsShareUnreturnedStake: false,
    shouldUseSupervisorInactionGuard: false,
    metadataURI: metadataURI,
  };

  try {
    const parsedStakeAmount = parseEther(stakeAmount);
    deployData.stakeAmount = parsedStakeAmount;
  } catch (err) {
    deployData.stakeAmount = parseEther("0");
  }

  try {
    const parsedReturnWindowDays = parseInt(returnWindowDays);
    deployData.returnWindowDays = parsedReturnWindowDays;
  } catch (err) {
    deployData.returnWindowDays = 0;
  }

  const { config } = usePrepareContractWrite({
    addressOrName: pepperStakeDeployer.address,
    contractInterface: pepperStakeDeployer.abi,
    functionName: "deployPepperStake",
    args: [...Object.values(deployData)],
  });
  return useContractWrite(config);
}
