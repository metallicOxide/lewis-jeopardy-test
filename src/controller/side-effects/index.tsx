import { ExpiredImageCleanupSideEffect } from "./expired-image-cleanup-side-effect";

import { HostSideEffect } from "./host-side-effect";

export const SideEffects = () => {
  return (
    <>
      <ExpiredImageCleanupSideEffect />
      <HostSideEffect />
    </>
  );
};
