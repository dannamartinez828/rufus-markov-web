# Spec Delta

## Purpose

Esta capacidad modela los saltos de Rufus entre puntos de una línea temporal mediante una cadena de Markov. Permite calcular distribuciones de probabilidad para uno o varios horizontes a partir del punto inicial elegido.

## ADDED Requirements

### Requirement: Modelo de transición temporal
El sistema SHALL usar los estados Aldea, Elysium, Tiempo intermedio y Apocalipsis, en ese orden, con la matriz de transición supuesta cuyas filas representan el estado actual y columnas el estado siguiente.

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
