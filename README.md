# GitHub social login
API simple creada con NodeJS, fastify y MongoDB para iniciar sesión con GitHub y marcar repositorios.

[![CodeFactor](https://www.codefactor.io/repository/github/v1ctorio/jobarcelona-backend/badge)](https://www.codefactor.io/repository/github/v1ctorio/jobarcelona-backend)

## Endpoints
| Endpoint | Método | Descripción |
| --- | --- | --- |
| / | GET | Inicio |
| /login | GET | Iniciar sesión con GitHub |
| /callback | GET | Callback de GitHub |
| /logout | GET | Cerrar sesión |
| /me | GET | Perfil de usuario |
| /users | GET | Lista de usuarios registrados |
| /star?repo=owner/repo | GET | Marca el repositorio especificado |

## Instalación
Para usar el repositorio por ti mismo, sigue los siguientes pasos:
1. Crea una aplicación de OAuth en GitHub (https://github.com/settings/applications/new)
2. Genera un client secret
3. Crea una base de datos de MongoDB
4. Clona el repositorio (`git clone github.com/v1ctorio/jobarcelona-backend`)
5. Instala las dependencias (`yarn`)
6. Configura las variables de entorno, para eso rellena el archivo `.env.example` y renómbralo a `.env`
7. Transpila el typescript (`yarn build`)
8. Inicia el servidor (`yarn start`)

## Stack
- [NodeJS](httpps://nodejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Fastify](https://fastify.io)
- [MongoDB](https://mongodb.com)
- [Mongoose](https://mongoosejs.com)
