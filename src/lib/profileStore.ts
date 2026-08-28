import { createStore } from "@tanstack/react-store";

export type Profile = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
};

export const profileStore = createStore<{
	profile: Profile | null;
}>({
	profile: null,
});

export const setProfile = (profile: Profile | null) => {
	profileStore.setState((state) => ({
		...state,
		profile,
	}));
};
