import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { config } from "dotenv";
config();

export class LambdaInvoker {
    private lambdaCliente : LambdaClient;

    constructor() {
        this.lambdaCliente = new LambdaClient({ region: process.env.AWS_REGION });
    }

    async inovkeLambda(funcitonName: string, payload: object): Promise<any> {
        const command = new InvokeCommand({
            FunctionName: funcitonName,
            Payload: Buffer.from(JSON.stringify(payload)),
            InvocationType: "RequestResponse",
        });

        try {
            const response = await this.lambdaCliente.send(command);
            const responsePayload = JSON.parse(Buffer.from(response.Payload as Uint8Array).toString());
            console.log("Respuesta del Lambda:", responsePayload);

            if (responsePayload.errorMessage) {
                console.error("Error en la respuesta del Lambda:", responsePayload.errorMessage);
                return { error: responsePayload.errorMessage, body: null };
            } else {
                console.log("Lambda ejecutado correctamente.");
                return { error: null, body: responsePayload };
            }
        } catch (error) {
            console.error("Error al invocar el Lambda:", error);
            throw error;
        }
    }
}