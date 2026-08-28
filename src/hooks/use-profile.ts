import { useSelector } from "@tanstack/react-store";
import { profileStore } from "#/lib/profileStore";

export const useProfile = () => {
	return useSelector(profileStore, (state) => state.profile);
};
