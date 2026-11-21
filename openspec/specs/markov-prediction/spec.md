# markov-prediction Specification

## Purpose
Esta capacidad modela los saltos de Rufus entre puntos de una línea temporal mediante una cadena de Markov. Permite calcular distribuciones de probabilidad para uno o varios horizontes a partir del punto inicial elegido.

## Requirements

### Requirement: Modelo de transición temporal
El sistema SHALL usar los estados Aldea Kuvaq, Eliseo, Tiempo intermedio y Reinicio, en ese orden, con la matriz de transición supuesta cuyas filas representan el estado actual y columnas el estado siguiente.

#### Scenario: Nombres y probabilidades de transición
- **WHEN** se consulta el modelo
- **THEN** los estados se llaman Aldea Kuvaq, Eliseo, Tiempo intermedio y Reinicio, y las filas de la matriz, en ese orden, siguen siendo `[0.50, 0.35, 0.05, 0.10]`, `[0.05, 0.45, 0.30, 0.20]`, `[0.10, 0.15, 0.55, 0.20]` y `[0.60, 0.05, 0.05, 0.30]`

#### Scenario: Probabilidades supuestas configuradas
- **WHEN** se consulta la matriz del modelo
- **THEN** sus filas, en el orden de los estados, son `[0.50, 0.35, 0.05, 0.10]`, `[0.05, 0.45, 0.30, 0.20]`, `[0.10, 0.15, 0.55, 0.20]` y `[0.60, 0.05, 0.05, 0.30]`

### Requirement: Validación de matriz de transición
El sistema SHALL rechazar una matriz de transición que no sea cuadrada, contenga valores negativos o tenga alguna fila cuya suma no sea 1 dentro de la precisión numérica.

#### Scenario: Matriz no cuadrada
- **WHEN** se valida una matriz con distinto número de filas y columnas
- **THEN** la validación lanza un error

#### Scenario: Matriz con probabilidad negativa
- **WHEN** se valida una matriz cuadrada que contiene un valor negativo
- **THEN** la validación lanza un error

#### Scenario: Fila que no suma uno
- **WHEN** se valida una matriz cuadrada no negativa con una fila cuya suma difiere de 1
- **THEN** la validación lanza un error

#### Scenario: Matriz válida
- **WHEN** se valida una matriz cuadrada no negativa cuyas filas suman 1
- **THEN** la validación la acepta

### Requirement: Multiplicación y potencia de matrices
El sistema SHALL multiplicar matrices con dimensiones compatibles y elevar matrices cuadradas a una potencia entera no negativa; la potencia cero SHALL producir la matriz identidad correspondiente.

#### Scenario: Multiplicar matrices compatibles
- **WHEN** se multiplican dos matrices con dimensiones compatibles
- **THEN** el resultado contiene los productos fila por columna

#### Scenario: Potencia positiva
- **WHEN** se eleva una matriz cuadrada a una potencia entera positiva
- **THEN** el resultado equivale a multiplicar la matriz por sí misma esa cantidad de veces

#### Scenario: Potencia cero
- **WHEN** se eleva una matriz cuadrada a cero
- **THEN** el resultado es la matriz identidad de su dimensión

#### Scenario: Dimensiones de multiplicación incompatibles
- **WHEN** se multiplican matrices cuyas dimensiones no son compatibles
- **THEN** la operación lanza un error

### Requirement: Distribución a n saltos
El sistema SHALL calcular la distribución de puntos temporales tras n saltos desde un estado inicial válido, aplicando al vector inicial la potencia n de la matriz de transición.

#### Scenario: Predicción desde un estado existente
- **WHEN** se solicita la distribución para un estado existente y n pasos válidos
- **THEN** se devuelve una probabilidad para cada estado en el orden definido por el modelo

#### Scenario: Cero saltos
- **WHEN** se solicita la distribución desde un estado existente para n = 0
- **THEN** se devuelve el vector inicial concentrado completamente en ese estado

#### Scenario: Estado inicial inexistente
- **WHEN** se solicita una distribución desde un estado que no pertenece al modelo
- **THEN** la operación lanza un error

### Requirement: Validación del número de saltos
El sistema SHALL aceptar únicamente valores enteros no negativos para n en las operaciones de potencia y predicción.

#### Scenario: Número de saltos negativo
- **WHEN** se solicita una predicción o potencia con n negativo
- **THEN** la operación lanza un error

#### Scenario: Número de saltos no entero
- **WHEN** se solicita una predicción o potencia con n no entero
- **THEN** la operación lanza un error

### Requirement: Predicciones para horizontes requeridos
El sistema SHALL ofrecer, en una sola llamada para un estado inicial válido, las distribuciones correspondientes a 1, 3, 5 y 10 saltos.

#### Scenario: Obtener todos los horizontes
- **WHEN** se solicitan las predicciones agrupadas para un estado inicial
- **THEN** la respuesta contiene una distribución para cada uno de los pasos 1, 3, 5 y 10

### Requirement: Conservación de probabilidad
El sistema SHALL devolver distribuciones cuya suma de probabilidades es 1 dentro de la precisión numérica.

#### Scenario: Suma de una distribución calculada
- **WHEN** se obtiene una distribución para cualquier estado inicial válido y número de pasos válido
- **THEN** la suma de las probabilidades de todos los estados es 1 dentro de la precisión numérica

### Requirement: Metadatos de los estados temporales
Cada estado SHALL incluir un nombre, una descripción narrativa, la ruta de su escena y la ruta de la pose de Rufus, relativas a `assets/img/`.

#### Scenario: Datos de los cuatro estados
- **WHEN** se consultan los estados del modelo
- **THEN** Aldea Kuvaq tiene la descripción `El pueblo de Rufus en Deponia. Aquí despierta al inicio de cada bucle, recordando todo.`, la escena `escenas/kuvaq.jpg` y la pose `rufus/aldea.png`; Eliseo tiene `La ciudad flotante. Rufus viaja hasta aquí con el profesor McChronicle, antes de que se estrelle.`, `escenas/eliseo.jpg` y `rufus/eliseo.gif`; Tiempo intermedio tiene `Un espacio de agujeros de gusano que conecta todas las líneas temporales.`, `escenas/intermedio.jpg` y `rufus/intermedio.png`; Reinicio tiene `El mundo se destruye y el tiempo vuelve atrás. Solo Rufus, el profesor McChronicle y Tuck conservan la memoria.`, `escenas/reinicio.jpg` y `rufus/reinicio.png`

### Requirement: Simulación aleatoria de recorrido
El modelo SHALL proporcionar `simularRecorrido(estadoInicial, saltos, aleatorio = Math.random)`, que devuelve exactamente un nombre de estado por transición, sin incluir el estado inicial.

#### Scenario: Longitud del recorrido
- **WHEN** se simula un recorrido con un estado inicial válido y `saltos` no negativo
- **THEN** se devuelve un arreglo con exactamente `saltos` estados visitados después de cada transición

#### Scenario: Cero saltos
- **WHEN** se simula un recorrido con `saltos = 0`
- **THEN** se devuelve un arreglo vacío

#### Scenario: Aleatorio cero selecciona la primera transición posible
- **WHEN** el generador inyectado devuelve `0` en cada transición
- **THEN** cada paso elige el primer estado de la fila cuya probabilidad sea mayor que cero

#### Scenario: Aleatorio 0.99 selecciona la última transición posible
- **WHEN** el generador inyectado devuelve `0.99` en cada transición
- **THEN** cada paso elige el último estado de la fila cuya probabilidad sea mayor que cero

#### Scenario: Estado inicial inexistente
- **WHEN** se solicita un recorrido desde un estado que no existe
- **THEN** la función lanza un error

#### Scenario: Cantidad de saltos negativa o no entera
- **WHEN** se solicita un recorrido con `saltos` negativo o no entero
- **THEN** la función lanza un error
