import { useUser } from "@clerk/nextjs";

export const useUpdateXp = () => {
    const { user } = useUser();

    const updateXp = async () => {
        if (!user?.primaryEmailAddress?.emailAddress) return;

        try {
            const response = await fetch("/api/xp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userEmail: user.primaryEmailAddress.emailAddress,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                return data.xp;
            }
        } catch (error) {
            console.error("Error updating XP:", error);
        }
    };

    return { updateXp };
};
