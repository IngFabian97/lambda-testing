import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { config } from "dotenv";
config();

const lambda = new LambdaClient({ region: process.env.AWS_REGION });

async function invocarLambda(){
    const functionName = "Clima";
    const payload = JSON.stringify({ city: "Cúcuta" });

    const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: Buffer.from(payload),
        InvocationType: "RequestResponse",
    });

    try{
        const response = await lambda.send(command);
        const responsePayload = JSON.parse(Buffer.from(response.Payload as Uint8Array).toString());
        console.log("Respuesta del Lambda:", responsePayload);

        if(responsePayload.errorMessage){
            console.error("Error en la respuesta del Lambda:", responsePayload.errorMessage);
        }
        else{
            console.log("Lambda ejecutado correctamente.");
        }
    }
    catch (error){
        console.error("Error al invocar el Lambda:", error);
    }
}

invocarLambda();