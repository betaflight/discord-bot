import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type PullRequest = ArrayElement<RestEndpointMethodTypes["pulls"]["list"]["response"]["data"]>;