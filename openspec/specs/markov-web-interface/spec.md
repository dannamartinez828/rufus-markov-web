# markov-web-interface Specification

## Purpose
Esta capacidad presenta en una página web accesible y responsive las predicciones temporales existentes de Rufus. Permite elegir un estado inicial, consultar la matriz y comparar probabilidades para los cuatro horizontes previstos.

## Requirements

### Requirement: Página explicativa en español
La aplicación SHALL mostrar en español el título “Rufus en el bucle”, una explicación breve de las cadenas de Markov y de los bucles temporales de Deponia Doomsday, y la pose de Rufus de Aldea Kuvaq en el encabezado con texto alternativo descriptivo y carga diferida.

#### Scenario: Cargar la página principal
- **WHEN** una persona abre la aplicación
- **THEN** ve el título y la explicación en español y la pose `assets/img/rufus/aldea.png` en el encabezado con texto alternativo en español y carga diferida

### Requirement: Selector visual del estado inicial
La aplicación SHALL permitir elegir Aldea Kuvaq, Eliseo, Tiempo intermedio o Reinicio y mostrar en cada tarjeta la descripción, la escena de fondo y la pose superpuesta de Rufus, con textos alternativos en español y carga diferida.

#### Scenario: Mostrar opciones de estado
- **WHEN** se presenta el selector del estado inicial
- **THEN** cada uno de los cuatro estados aparece con su nombre, descripción, escena correspondiente y pose de Rufus, y sus imágenes tienen texto alternativo descriptivo y carga diferida

### Requirement: Tabla de transición
La aplicación SHALL mostrar la matriz de transición existente como una tabla con los nombres actualizados de los estados y celdas coloreadas según la probabilidad representada.

#### Scenario: Consultar probabilidades de transición
- **WHEN** se muestra la tabla
- **THEN** sus filas, columnas y probabilidades corresponden a la matriz sin cambios, usan los nombres Aldea Kuvaq, Eliseo, Tiempo intermedio y Reinicio, y cada valor permanece legible junto a su color

### Requirement: Resultados por horizonte
La aplicación SHALL mostrar una tarjeta para cada horizonte de 1, 3, 5 y 10 pasos, con las probabilidades de todos los estados actualizadas expresadas en porcentaje.

#### Scenario: Mostrar las cuatro tarjetas
- **WHEN** hay un estado inicial seleccionado
- **THEN** se presenta una tarjeta por horizonte con una probabilidad porcentual para Aldea Kuvaq, Eliseo, Tiempo intermedio y Reinicio

### Requirement: Estado más probable en cada tarjeta
Cada tarjeta SHALL mostrar el nombre del estado de mayor probabilidad con la escena correspondiente como fondo y la pose de Rufus superpuesta; ambas imágenes SHALL tener textos alternativos en español y carga diferida.

#### Scenario: Identificar el estado más probable
- **WHEN** se presenta una tarjeta de resultados
- **THEN** muestra el nombre actualizado del estado más probable, su escena y su pose accesibles

### Requirement: Actualización al cambiar el estado inicial
La aplicación SHALL actualizar las cuatro tarjetas al cambiar el estado inicial, consumiendo los resultados del modelo existente sin volver a implementar sus cálculos en la interfaz.

#### Scenario: Cambiar estado inicial
- **WHEN** se selecciona un estado inicial distinto
- **THEN** los resultados de 1, 3, 5 y 10 pasos se actualizan para ese estado

### Requirement: Formateo de porcentajes
La función pública `formatearPorcentaje(p)` SHALL convertir una probabilidad entre 0 y 1 a un porcentaje con un decimal y el sufijo ` %`.

#### Scenario: Formatear una probabilidad de cincuenta por ciento
- **WHEN** se llama `formatearPorcentaje(0.5)`
- **THEN** devuelve exactamente `50.0 %`

### Requirement: Selección del estado más probable
La función pública `estadoMasProbable(distribucion, estados)` SHALL devolver el valor `nombre` del estado correspondiente a la probabilidad máxima; en caso de empate, SHALL devolver el primer estado máximo en el orden recibido.

#### Scenario: Encontrar la probabilidad máxima
- **WHEN** se llama con una distribución y los estados con metadatos, y existe un máximo único
- **THEN** devuelve el nombre del estado asociado a ese máximo

#### Scenario: Resolver empate según el orden recibido
- **WHEN** dos o más estados comparten la probabilidad máxima
- **THEN** devuelve el nombre del primero de esos estados según el arreglo recibido

### Requirement: Diseño responsive y pie de página
La aplicación SHALL adaptar selector, tabla, tarjetas de personajes, guía y simulador a celulares y computadores, y conservar el pie de página de atribución solicitado.

#### Scenario: Ver la página en distintos tamaños
- **WHEN** la aplicación se muestra en una pantalla móvil o de escritorio
- **THEN** las secciones y las imágenes con texto alternativo en español permanecen utilizables y el pie muestra `Imágenes de Deponia © Daedalic Entertainment, uso educativo`

### Requirement: Inicio del servidor local
El proyecto SHALL iniciar la aplicación mediante `npm start`, servirla en `http://localhost:8000` y responder con el tipo de contenido correcto para las escenas `.jpg`.

#### Scenario: Iniciar la aplicación
- **WHEN** se ejecuta `npm start`
- **THEN** la página principal queda disponible en `http://localhost:8000`

#### Scenario: Servir una escena JPEG
- **WHEN** se solicita una imagen `.jpg` existente de `assets/img/escenas/`
- **THEN** el servidor responde con estado 200 y tipo de contenido `image/jpeg`

### Requirement: Pruebas de los formateadores
Las funciones puras de presentación SHALL poder probarse con el runner integrado `node:test`, ejecutado mediante `npm test`.

#### Scenario: Ejecutar pruebas de presentación
- **WHEN** se ejecuta `npm test`
- **THEN** se ejecutan las pruebas de `formatearPorcentaje` y `estadoMasProbable` sin requerir un navegador

### Requirement: Personajes del bucle
La aplicación SHALL incluir una sección “Los personajes del bucle” con una tarjeta de texto para cada uno de los seis personajes especificados.

#### Scenario: Leer las tarjetas de personajes
- **WHEN** se consulta la sección de personajes
- **THEN** aparecen Rufus (inmune al reinicio y siempre recuerda), Goal (habitante de Elysium que roba la cápsula del tiempo), Profesor McChronicle (físico del tiempo cuyo coche es la máquina del tiempo), Tuck (borracho del pueblo que se une a Rufus y recibe un gorro de papel aluminio), Los Fewlocks (parodia de los Morlocks de *La máquina del tiempo*) y Los utopianos (observan la historia e intentan corregirla)

### Requirement: Guía para leer la aplicación
La aplicación SHALL explicar en lenguaje sencillo qué son un estado y una matriz de transición, la propiedad de Markov, el cálculo a n pasos y que las probabilidades son supuestos del modelo, no datos oficiales del juego.

#### Scenario: Consultar cómo leer la aplicación
- **WHEN** una persona abre la sección “Cómo leer esta aplicación”
- **THEN** encuentra explicados los estados, las filas y columnas de la matriz, que el siguiente estado depende solo del actual, que n pasos usan la matriz elevada a n y que las probabilidades no son datos oficiales de Deponia Doomsday

### Requirement: Simulador visual de diez saltos
La aplicación SHALL ofrecer un botón “Simular 10 saltos” que ejecute un recorrido aleatorio desde el estado inicial seleccionado y muestre el estado inicial y cada estado visitado, con escena y pose, textos alternativos en español y carga diferida.

#### Scenario: Simular un recorrido
- **WHEN** se activa “Simular 10 saltos”
- **THEN** se muestra el estado inicial seguido por diez estados simulados, la escena y la pose de cada uno con texto alternativo en español y carga diferida, y el número de transiciones que llegaron a Reinicio
