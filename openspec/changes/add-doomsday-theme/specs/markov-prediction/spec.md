# Spec Delta

## MODIFIED Requirements

### Requirement: Modelo de transición temporal
El sistema SHALL usar los estados Aldea Kuvaq, Eliseo, Tiempo intermedio y Reinicio, en ese orden, con la matriz de transición supuesta cuyas filas representan el estado actual y columnas el estado siguiente.

#### Scenario: Nombres y probabilidades de transición
- **WHEN** se consulta el modelo
- **THEN** los estados se llaman Aldea Kuvaq, Eliseo, Tiempo intermedio y Reinicio, y las filas de la matriz, en ese orden, siguen siendo `[0.50, 0.35, 0.05, 0.10]`, `[0.05, 0.45, 0.30, 0.20]`, `[0.10, 0.15, 0.55, 0.20]` y `[0.60, 0.05, 0.05, 0.30]`

#### Scenario: Probabilidades supuestas configuradas
- **WHEN** se consulta la matriz del modelo
- **THEN** sus filas, en el orden de los estados, son `[0.50, 0.35, 0.05, 0.10]`, `[0.05, 0.45, 0.30, 0.20]`, `[0.10, 0.15, 0.55, 0.20]` y `[0.60, 0.05, 0.05, 0.30]`

## ADDED Requirements

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
