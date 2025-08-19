
interface Window {
    WeixinJSBridge?: {
        invoke: (
        method: string,
        params: Record<string, any>,
        callback: (res: any) => void
        ) => void;

    };
}