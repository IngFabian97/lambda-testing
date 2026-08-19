import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { config } from "dotenv";
config();

type LambdaEnvelope<TBody> = {
    body?: TBody | string;
    errorMessage?: string;
    statusCode?: number;
};

type LambdaInvocationResult<TBody = unknown> = {
    error: string | null;
    body: TBody | null;
    statusCode?: number;
};

export class LambdaInvoker {
    private lambdaClient: LambdaClient;

    constructor() {
        this.lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });
    }

    async invokeLambda<TBody = unknown>(
        functionName: string,
        payload: object
    ): Promise<LambdaInvocationResult<TBody>> {
        const command = new InvokeCommand({
            FunctionName: functionName,
            Payload: Buffer.from(JSON.stringify(payload)),
            InvocationType: "RequestResponse",
        });

        try {
            const response = await this.lambdaClient.send(command);
            if (!response.Payload) {
                return { error: "Empty Lambda payload", body: null };
            }

            const responsePayload = JSON.parse(Buffer.from(response.Payload).toString()) as LambdaEnvelope<TBody>;
            console.log("Respuesta del Lambda:", responsePayload);

            if (responsePayload.errorMessage) {
                console.error("Error en la respuesta del Lambda:", responsePayload.errorMessage);
                return { error: responsePayload.errorMessage, body: null };
            } else {
                console.log("Lambda ejecutado correctamente.");
                const parsedBody =
                    typeof responsePayload.body === "string"
                        ? JSON.parse(responsePayload.body)
                        : responsePayload.body;

                return {
                    error: null,
                    body: parsedBody ?? null,
                    statusCode: responsePayload.statusCode,
                };
            }
        } catch (error) {
            console.error("Error al invocar el Lambda:", error);
            throw error;
        }
    }
}