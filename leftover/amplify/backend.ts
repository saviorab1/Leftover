import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
  data,
});

// Primary region (ap-southeast-1)
const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.ap-southeast-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "ap-southeast-1",
      signingServiceName: "bedrock",
    },
  }
);

// Fallback region (ap-northeast-1)
const bedrockFallbackDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockFallbackDS",
  "https://bedrock-runtime.ap-northeast-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "ap-northeast-1",
      signingServiceName: "bedrock",
    },
  }
);

// Grant permissions for primary region
bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      "arn:aws:bedrock:ap-southeast-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0",
    ],
    actions: ["bedrock:InvokeModel"],
  })
);

// Grant permissions for fallback region
bedrockFallbackDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      "arn:aws:bedrock:ap-northeast-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0",
    ],
    actions: ["bedrock:InvokeModel"],
  })
);