import { test, expect } from '@playwright/test';
import { LambdaInvoker } from '../utils/LambdaInvoker.js';

type WeatherResponse = {
  temperature: number;
  [key: string]: unknown;
};

test('Probando flujo positivo del lambda Clima', async ({ }) => {
  const lambdaInvoker = new LambdaInvoker();
  const lambdaResponse = await lambdaInvoker.invokeLambda<WeatherResponse>("Clima", { city: "Cúcuta" });
  expect(lambdaResponse).toBeDefined();
  expect(lambdaResponse.error).toBeNull();
  expect(lambdaResponse.body).not.toBeNull();
  if (!lambdaResponse.body) {
    throw new Error('Lambda returned an empty body');
  }
  const responseBody = lambdaResponse.body;
  expect(responseBody).toHaveProperty('temperature');
  expect(responseBody.temperature).toBeGreaterThan(0);
  console.log("Temperatura:", responseBody.temperature);

})