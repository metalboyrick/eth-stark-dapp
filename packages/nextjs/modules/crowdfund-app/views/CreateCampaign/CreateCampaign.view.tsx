"use client";

import { ReactNode, createContext, useContext } from "react";
import { CreateCampaignProps } from "./CreateCampaign.types";
import { useCreateCampaignController } from "./CreateCampaign.controller";
import { ContractType } from "~~/types/aggregations";

const CreateCampaignContext = createContext<
  ReturnType<typeof useCreateCampaignController> | undefined
>(undefined);

function FormSection({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-1">{children}</div>;
}

function FormLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm ">
      {children}
    </label>
  );
}

const contractTypeToNetworkName = {
  [ContractType.ETH]: "Ethereum",
  [ContractType.Starknet]: "StarkNet",
};

// implement UI here
function CreateCampaignView(props: CreateCampaignProps) {
  const {
    isCreateCampaignLoading,
    handleCreateCampaign,
    campaignData,
    updateCampaignData,
    isPageLoading,
  } = useContext(CreateCampaignContext)!;

  if (isPageLoading)
    return (
      <div className="w-full h-[60vh] flex flex-col justify-center items-center">
        <div className="loading loading-bars loading-lg mb-5"></div>
        <div className="text-2xl">Loading Page...</div>
      </div>
    );

  return (
    <div className="flex justify-center items-center">
      <div className="w-3/5 p-5 flex flex-col items-center justify-center justify-self-center rounded-md border border-slate-600 mt-10">
        <h1 className="text-2xl font-bold pb-4">Create Campaign</h1>
        <div className="flex flex-col gap-4 w-full">
          <FormSection>
            <FormLabel htmlFor="name">Title</FormLabel>
            <input
              type="text"
              name="name"
              value={campaignData.name}
              placeholder="My Cool Project"
              className="input"
              onChange={(e) => updateCampaignData({ name: e.target.value })}
            />
          </FormSection>

          <FormSection>
            <FormLabel htmlFor="description">Description</FormLabel>
            <textarea
              name="description"
              className="textarea"
              value={campaignData.description}
              placeholder="Funding this project!"
              onChange={(e) =>
                updateCampaignData({ description: e.target.value })
              }
            />
          </FormSection>

          {/* TODO: networks */}
          <FormSection>
            <FormLabel htmlFor="targetAmount">Network</FormLabel>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn w-full">
                <div className="w-full flex justify-start">
                  {contractTypeToNetworkName[campaignData.network]}
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      updateCampaignData({ network: ContractType.ETH })
                    }
                  >
                    Ethereum
                  </div>
                </li>
                <li>
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      updateCampaignData({ network: ContractType.Starknet })
                    }
                  >
                    StarkNet
                  </div>
                </li>
              </ul>
            </div>
          </FormSection>

          <FormSection>
            <FormLabel htmlFor="targetAmount">Target Amount</FormLabel>
            <div className="flex items-center justify-between input">
              <input
                type="number"
                name="targetAmount"
                value={campaignData.targetAmountInUSDT}
                placeholder="1000"
                className="flex-1"
                onChange={(e) =>
                  updateCampaignData({
                    targetAmountInUSDT: parseInt(e.target.value),
                  })
                }
              />
              <div className="font-bold">USDT</div>
            </div>
          </FormSection>

          <FormSection>
            <FormLabel htmlFor="duration">Deadline</FormLabel>
            <div className="flex items-center justify-between input">
              <input
                type="number"
                name="duration"
                value={campaignData.durationInSeconds / 86400}
                placeholder="10"
                className="flex-1"
                onChange={(e) =>
                  updateCampaignData({
                    durationInSeconds: parseInt(e.target.value) * 86400,
                  })
                }
              />
              <div className="font-bold">Days</div>
            </div>
          </FormSection>

          <button
            className={`btn btn-primary btn-lg w-full mt-3 ${isCreateCampaignLoading && "btn-disabled"}`}
            onClick={(e) => {
              e.preventDefault();
              if (isCreateCampaignLoading) return;

              const {
                name,
                description,
                durationInSeconds: duration,
                targetAmountInUSDT: targetAmount,
              } = campaignData;
              handleCreateCampaign({
                targetAmount,
                duration,
                data: JSON.stringify({
                  name,
                  description,
                  startTime: new Date(),
                }),
              });
            }}
          >
            Start Raising
            {isCreateCampaignLoading && (
              <span className="loading loading-spinner"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateCampaign(props: CreateCampaignProps) {
  const controller = useCreateCampaignController(props);

  return (
    <CreateCampaignContext.Provider value={controller}>
      <CreateCampaignView {...props} />
    </CreateCampaignContext.Provider>
  );
}
