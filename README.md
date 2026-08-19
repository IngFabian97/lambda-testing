# lambda-testing

Proyecto de prueba para invocar una función AWS Lambda desde TypeScript y validar su respuesta con Playwright.

## Requisitos

- Node.js 20 o superior
- Credenciales de AWS configuradas en el entorno
- Variable `AWS_REGION` definida

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` con algo como esto:

```env
AWS_REGION=us-east-1
```

Si tu entorno usa otras credenciales, también puedes definir:

```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_SESSION_TOKEN=...
```

## Ejecutar la invocación del Lambda

```bash
npm start
```

Ese comando ejecuta `ClimaLambda.ts`, que invoca la función `Clima`.

## Ejecutar las pruebas

```bash
npx playwright test
```

## Estructura

- `ClimaLambda.ts`: script principal para invocar la Lambda
- `utils/LambdaInvoker.ts`: clase reutilizable para invocar Lambdas
- `tests/LambdaClima.spec.ts`: prueba principal del flujo
- `playwright.config.ts`: configuración de Playwright

## Notas

- El proyecto espera que la respuesta de la Lambda tenga un `body` JSON serializado.
- Si cambia el formato de la respuesta, ajusta `LambdaInvoker` y el spec en conjunto.
