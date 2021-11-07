# Inventario de vacunación de empleados

Kruger Corporation requiere una aplicación para llevar un registro del inventario del estado de
vacunación de los empleados.

La aplicación contará con 2 roles: Administrador y Empleado.
Para el desarrollo de la aplicación tenemos las siguientes historias de usuario.

## Como Administrador requiere registrar, editar, listar y eliminar a los empleados.

Criterios de aceptación:

### a. Registrar la siguiente información del empleado.

- Cédula.

- Nombres.

- Apellidos.

- Correo electrónico.

### b. Los campos deben contener validaciones de acuerdo al tipo de dato:

- Todos los campos son requeridos.

- Cédula válida. (Incluir un valor numérico y único de 10 dígitos)

- Correo electrónico válido.

- Nombres y apellidos no deben contener números o caracteres especiales.

### c. Al dar de alta un empleado se debe generar un usuario y contraseña para el empleado.

## 2. Como Empleado requiero ingresar al sistema para visualizar y actualizar mi información.

Criterios de aceptación:

### a. Completar la siguiente información:

- Fecha de nacimiento.

- Dirección de domicilio.

- Teléfono móvil.

- Estado de vacunación: Vacunado / No Vacunado.

- Si el empleado está en estado vacunado, se debe pedir la siguiente información
  requerida:

- Tipo de vacuna: Sputnik, AstraZeneca, Pfizer y Jhonson&Jhonson

- Fecha de vacunación.

- Número de dosis.

## 3. Como Administrador se requiere filtrar el listado de los empleados por los siguientes criterios.

Criterios de aceptación:

### a. Filtrar por estado de vacunación.

### b. Filtrar por tipo de vacuna.

### c. Filtrar por rango de fecha de vacunación.

# Instalación de dependencias

```bash
$ git clone https://github.com/jonathanJet/krugerTestFrontEnd.git
$ cd krugerTestFrontEnd
$ npm install
```

# Ejecución de json server para persistencia de datos

ubicación archivo de persistencia

```text
src
├── assets
    ├── data
        ├── db.json
```

```bash
$ npm run jsonServer
```

## Consulta de apis:

`http://localhost:3000/`

# Ejecución

```bash
$ npm run hmr
```

Acceder a `http://localhost:4200/`.

- Credenciales: User: ng-matero ; Password: ng-matero
- Nora: las credenciales para pruebas estan accesibles en el archivo de persistencia

## Author

- **Jonathan Torres C.** - email: jonathan.torresc@hotmail.com
