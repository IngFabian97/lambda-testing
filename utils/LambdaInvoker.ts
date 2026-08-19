import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { config } from "dotenv";
config();

type LambdaInvocationResult = {
    error: string | null;
    body: Record<string, unknown> | null;
    statusCode?: number;
};

export class LambdaInvoker {
    private lambdaClient: LambdaClient;

    constructor() {
        this.lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });
    }

    async invokeLambda(functionName: string, payload: object): Promise<LambdaInvocationResult> {
        const command = new InvokeCommand({
            FunctionName: functionName,
            Payload: Buffer.from(JSON.stringify(payload)),
            InvocationType: "RequestResponse",
        });

        try {
            const response = await this.lambdaClient.send(command);
            const responsePayload = JSON.parse(Buffer.from(response.Payload as Uint8Array).toString());
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
                    body: parsedBody as Record<string, unknown>,
                    statusCode: responsePayload.statusCode,
                };
            }
        } catch (error) {
            console.error("Error al invocar el Lambda:", error);
            throw error;
        }
    }
}