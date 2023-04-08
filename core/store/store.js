import { createGlobalstate } from "state-pool";

export const store = createGlobalstate({
    visible: false,
    message: "",
    success: false,
})