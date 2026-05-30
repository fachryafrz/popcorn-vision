import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";

const authConfig = {
  providers: [getAuthConfigProvider()],
};

export default authConfig;
