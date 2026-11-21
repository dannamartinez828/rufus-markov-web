# Spec Delta

## Purpose

Esta capacidad presenta en una página web accesible y responsive las predicciones temporales existentes de Rufus. Permite elegir un estado inicial, consultar la matriz y comparar probabilidades para los cuatro horizontes previstos.

## ADDED Requirements

### Requirement: Página explicativa en español
La aplicación SHALL mostrar en español el título “Rufus en el bucle” y una explicación breve de las cadenas de Markov y de los bucles temporales de Deponia Doomsday.

#### Scenario: Cargar la página principal
- **WHEN** una persona abre la aplicación
- **THEN** ve el título y la explicación en español

### Requirement: Selector visual del estado inicial
La aplicación SHALL permitir elegir entre Aldea, Elysium, Tiempo intermedio y Apocalipsis, mostrando para cada opción la imagen correspondiente con texto alternativo descriptivo.

#### Scenario: Mostrar opciones de estado
- **WHEN** se presenta el selector del estado inicial
- **THEN** cada uno de los cuatro estados aparece con su imagen y un texto alternativo que identifica a Rufus y el estado

### Requirement: Tabla de transición
La aplicación SHALL mostrar la matriz de transición del modelo existente como una tabla con nombres de estados y celdas coloreadas según la probabilidad representada.

#### Scenario: Consultar probabilidades de transición
- **WHEN** se muestra la tabla
- **THEN** sus filas, columnas y probabilidades corresponden a la matriz del modelo y cada valor permanece legible junto a su color

### Requirement: Resultados por horizonte
La aplicación SHALL mostrar una tarjeta para cada horizonte de 1, 3, 5 y 10 pasos, con las probabilidades de todos los estados expresadas en porcentaje.

#### Scenario: Mostrar las cuatro tarjetas
- **WHEN** hay un estado inicial seleccionado
- **THEN** se presenta una tarjeta por horizonte con una probabilidad porcentual para cada estado

### Requirement: Estado más probable en cada tarjeta
Cada tarjeta SHALL mostrar el nombre y la imagen del estado con mayor probabilidad, y la imagen SHALL tener texto alternativo descriptivo.

#### Scenario: Identificar el estado más probable
- **WHEN** se presenta una tarjeta de resultados
- **THEN** la tarjeta muestra el nombre y la imagen accesible del estado de mayor probabilidad para ese horizonte

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
La función pública `estadoMasProbable(distribucion, estados)` SHALL devolver el nombre correspondiente a la probabilidad máxima; en caso de empate, SHALL devolver el primer estado en el orden recibido.

#### Scenario: Encontrar la probabilidad máxima
- **WHEN** se llama con una distribución que tiene un máximo único
- **THEN** devuelve el nombre del estado asociado a ese máximo

#### Scenario: Resolver empate según el orden recibido
- **WHEN** dos o más estados comparten la probabilidad máxima
- **THEN** devuelve el primero de esos estados según el arreglo `estados`

### Requirement: Diseño responsive y pie de página
La aplicación SHALL adaptar su contenido a celulares y computadores y mostrar el texto alternativo de cada imagen y el pie de página de atribución solicitado.

#### Scenario: Ver la página en distintos tamaños
- **WHEN** la aplicación se muestra en una pantalla móvil o de escritorio
- **THEN** selector, tabla, resultados e imágenes permanecen utilizables y el pie muestra `Imágenes de Deponia © Daedalic Entertainment, uso educativo`

### Requirement: Inicio del servidor local
El proyecto SHALL iniciar la aplicación mediante `npm start` y servirla en `http://localhost:8000`.

#### Scenario: Iniciar la aplicación
- **WHEN** se ejecuta `npm start`
- **THEN** la página principal queda disponible en `http://localhost:8000`

### Requirement: Pruebas de los formateadores
Las funciones puras de presentación SHALL poder probarse con el runner integrado `node:test`, ejecutado mediante `npm test`.

#### Scenario: Ejecutar pruebas de presentación
- **WHEN** se ejecuta `npm test`
- **THEN** se ejecutan las pruebas de `formatearPorcentaje` y `estadoMasProbable` sin requerir un navegador
