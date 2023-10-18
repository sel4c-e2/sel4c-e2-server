# sel4c-e2-server

# Rutas de "/users"

1. **GET /users**

   - **Descripción:** Obtiene todos los usuarios.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con la información de los usuarios.

2. **GET /users/count**

   - **Descripción:** Obtiene el conteo total de usuarios.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con el conteo de usuarios.

3. **GET /users/user**

   - **Descripción:** Obtiene la información de un usuario autenticado a través de su token.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con la información del usuario.

4. **GET /users/start-quiz/:id**

   - **Descripción:** Obtiene si un usuario ha completado el cuestionario inicial.
   - **Parámetros:** `id` (ID del usuario).
   - **Respuesta:** JSON con la información sobre el progreso del usuario en el cuestionario inicial.

5. **GET /users/end-quiz/:id**

   - **Descripción:** Obtiene si un usuario ha completado el cuestionario final.
   - **Parámetros:** `id` (ID del usuario).
   - **Respuesta:** JSON con la información sobre el progreso del usuario en el cuestionario final.

6. **GET /users/:id**

   - **Descripción:** Obtiene la información de un usuario por su ID.
   - **Parámetros:** `id` (ID del usuario).
   - **Respuesta:** JSON con la información del usuario.

7. **POST /users**

   - **Descripción:** Crea un nuevo usuario.
   - **Parámetros:** Datos del usuario (nombre, edad, género, correo, país, universidad, contraseña).
   - **Respuesta:** JSON con la información del usuario y token de autenticación.

8. **POST /users/login**

   - **Descripción:** Inicia sesión de un usuario.
   - **Parámetros:** Correo y contraseña.
   - **Respuesta:** JSON con la información del usuario y token de autenticación.

9. **PUT /users/password/:id**

   - **Descripción:** Actualiza la contraseña de un usuario por su ID.
   - **Parámetros:** `id` (ID del usuario) y datos de contraseña (contraseña actual y nueva contraseña).
   - **Respuesta:** Mensaje de éxito.

10. **PUT /users/:id**

    - **Descripción:** Actualiza la información de un usuario por su ID (excepto la contraseña).
    - **Parámetros:** `id` (ID del usuario) y datos a actualizar.
    - **Respuesta:** Mensaje de éxito.

11. **DELETE /users/:id**

    - **Descripción:** Elimina un usuario por su ID.
    - **Parámetros:** `id` (ID del usuario).
    - **Respuesta:** Mensaje de éxito.
 
# Rutas de "/admins"

1. **GET /admins**

   - **Descripción:** Obtiene todos los administradores.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con la información de los administradores.

2. **GET /admins/count**

   - **Descripción:** Obtiene el conteo total de administradores.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con el conteo de administradores.

3. **GET /admins/admin**

   - **Descripción:** Obtiene la información de un administrador autenticado a través de su token.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con la información del administrador.

4. **POST /admins/login**

   - **Descripción:** Inicia sesión de un administrador.
   - **Parámetros:** Correo y contraseña.
   - **Respuesta:** JSON con la información del administrador y token de autenticación.

5. **POST /admins**

   - **Descripción:** Crea un nuevo administrador.
   - **Parámetros:** Datos del administrador (nombre, apellido, correo, contraseña).
   - **Respuesta:** JSON con el mensaje de éxito.

6. **GET /admins/:id**

   - **Descripción:** Obtiene la información de un administrador por su ID.
   - **Parámetros:** `id` (ID del administrador).
   - **Respuesta:** JSON con la información del administrador.

7. **PUT /admins/password/:id**

   - **Descripción:** Actualiza la contraseña de un administrador por su ID.
   - **Parámetros:** `id` (ID del administrador) y datos de contraseña (contraseña actual y nueva contraseña).
   - **Respuesta:** JSON con el mensaje de éxito.

8. **PUT /admins/:id**

   - **Descripción:** Actualiza la información de un administrador por su ID (excepto la contraseña).
   - **Parámetros:** `id` (ID del administrador) y datos a actualizar.
   - **Respuesta:** JSON con el mensaje de éxito.

9. **DELETE /admins/:id**

   - **Descripción:** Elimina un administrador por su ID.
   - **Parámetros:** `id` (ID del administrador).
   - **Respuesta:** JSON con el mensaje de éxito.

# Rutas de "/questions"

1. **GET /questions**

   - **Descripción:** Obtiene todas las preguntas.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con la información de las preguntas.

2. **GET /questions/type/:type**

   - **Descripción:** Obtiene preguntas de un tipo específico.
   - **Parámetros:** `type` (Tipo de pregunta).
   - **Respuesta:** JSON con la información de las preguntas del tipo especificado.

3. **GET /questions/display/:display**

   - **Descripción:** Obtiene preguntas con una configuración de visualización específica.
   - **Parámetros:** `display` (Configuración de visualización).
   - **Respuesta:** JSON con la información de las preguntas que tienen la configuración de visualización especificada.

4. **GET /questions/answers/user-id/:userId**

   - **Descripción:** Obtiene las respuestas de un usuario por su ID.
   - **Parámetros:** `userId` (ID del usuario).
   - **Respuesta:** JSON con las respuestas del usuario.

5. **POST /questions/answers**

   - **Descripción:** Registra o actualiza la respuesta de un usuario a una pregunta.
   - **Parámetros:** Datos de la respuesta (userId, questionId, answer).
   - **Respuesta:** JSON con el mensaje de éxito.

# Rutas de "/countries"

1. **GET /countries**

   - **Descripción:** Obtiene todos los países.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con la información de los países.

2. **GET /countries/:id**

   - **Descripción:** Obtiene la información de un país por su ID.
   - **Parámetros:** `id` (ID del país).
   - **Respuesta:** JSON con la información del país.

# Rutas de "/universities"

1. **GET /universities**

   - **Descripción:** Obtiene todas las universidades.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con la información de las universidades.

2. **GET /universities/country/:countryId**

   - **Descripción:** Obtiene las universidades de un país por su ID.
   - **Parámetros:** `countryId` (ID del país).
   - **Respuesta:** JSON con la información de las universidades del país.

3. **GET /universities/:id**

   - **Descripción:** Obtiene la información de una universidad por su ID.
   - **Parámetros:** `id` (ID de la universidad).
   - **Respuesta:** JSON con la información de la universidad.


# Rutas de "/activities"

1. **GET /activities**

   - **Descripción:** Obtiene todas las actividades.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con las actividades.

2. **GET /activities/count**

   - **Descripción:** Obtiene el conteo total de actividades.
   - **Parámetros:** Ninguno.
   - **Respuesta:** JSON con el conteo.

3. **GET /activities/:id**

   - **Descripción:** Obtiene una actividad por ID.
   - **Parámetros:** `id` (ID de la actividad).
   - **Respuesta:** JSON con la actividad.

4. **GET /activities/answers/:id**

   - **Descripción:** Obtiene las respuestas de una actividad por ID.
   - **Parámetros:** `id` (ID de la actividad).
   - **Respuesta:** JSON con las respuestas.

5. **GET /activities/count/answers/:activityId**

   - **Descripción:** Obtiene el conteo de respuestas para una actividad por ID.
   - **Parámetros:** `activityId` (ID de la actividad).
   - **Respuesta:** JSON con el conteo.

6. **POST /activities/upload**

   - **Descripción:** Sube un archivo asociado a una actividad.
   - **Parámetros:** `user_id` (ID del usuario), `activity_id` (ID de la actividad).
   - **Respuesta:** JSON con mensaje de éxito y ID del archivo.

7. **GET /activities/download/:user_id/:activity_id**

   - **Descripción:** Descarga un archivo asociado a una actividad.
   - **Parámetros:** `user_id` (ID del usuario), `activity_id` (ID de la actividad).
   - **Respuesta:** Archivo descargable.
