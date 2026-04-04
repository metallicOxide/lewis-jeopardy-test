import { useLayoutEffect } from "react";
import { useGameStore } from "../store";
import { cleanupExpiredImages } from "../../supabase/imageUpload";

export const ExpiredImageCleanupSideEffect = () => {
  const role = useGameStore((s) => s.role);

  // HACK - THIS IS GOD_MODE delete used to delete all images > 30 days old for cost saving
  // Should ideally be done on a backend function but I don't want to spend money
  // on a server
  useLayoutEffect(() => {
    if (role === "host") {
      cleanupExpiredImages();
    }
  }, [role]);

  return null;
};
