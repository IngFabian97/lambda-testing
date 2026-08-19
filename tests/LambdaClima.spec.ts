import { test, expect } from '@playwright/test';
import { LambdaInvoker } from '../utils/LambdaInvoker.js';

test('Probando flujo positivo del lambda Clima', async ({ }) => {
  const lambdaInvoker = new LambdaInvoker();
  const lambdaResponse = await lambdaInvoker.invokeLambda("Clima", { city: "Cúcuta" });
  expect(lambdaResponse).toBeDefined();
  expect(lambdaResponse.error).toBeNull();
  const responseBody = lambdaResponse.body;
  expect(responseBody.temperature).toBeGreaterThan(0);
  console.log("Temperatura:", responseBody.temperature);

})