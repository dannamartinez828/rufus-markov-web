# Spec Delta

## MODIFIED Requirements

### Requirement: Actualización al cambiar el estado inicial
La aplicación SHALL actualizar las cuatro tarjetas y ambas gráficas al cambiar el estado inicial, consumiendo los resultados del modelo existente sin volver a implementar sus cálculos en la interfaz.

#### Scenario: Cambiar estado inicial
- **WHEN** se selecciona un estado inicial distinto
- **THEN** los resultados de 1, 3, 5 y 10 pasos y los datos de las dos gráficas se actualizan para ese estado

#### Scenario: Evitar gráficas duplicadas
- **WHEN** se cambia el estado inicial después de haber mostrado las gráficas
- **THEN** cada gráfica presenta únicamente los datos del estado actual y no se acumulan canvas ni instancias duplicadas

### Requirement: Diseño responsive y pie de página
La aplicación SHALL adaptar selector, tabla, tarjetas de personajes, guía, simulador y gráficas a celulares y computadores, y conservar el pie de página de atribución solicitado.

#### Scenario: Ver la página en distintos tamaños
- **WHEN** la aplicación se muestra en una pantalla móvil o de escritorio
- **THEN** las secciones, gráficas e imágenes con texto alternativo en español permanecen utilizables sin desbordamiento y el pie muestra `Imágenes de Deponia © Daedalic Entertainment, uso educativo`

## ADDED Requirements

### Requirement: Gráfica de evolución por salto
La aplicación SHALL mostrar una gráfica de líneas con la probabilidad de cada estado desde el paso 0 hasta el paso 10, inclusive, para el estado inicial seleccionado.

#### Scenario: Consultar la evolución temporal
- **WHEN** se muestran las gráficas para un estado inicial
- **THEN** la gráfica de líneas presenta los pasos del 0 al 10 en el eje horizontal y una serie por cada estado con su probabilidad correspondiente

### Requirement: Gráfica comparativa de horizontes
La aplicación SHALL mostrar una gráfica de barras agrupadas que compare las probabilidades de todos los estados en los horizontes de 1, 3, 5 y 10 pasos para el estado inicial seleccionado.

#### Scenario: Comparar los cuatro horizontes
- **WHEN** se muestran las gráficas para un estado inicial
- **THEN** la gráfica de barras presenta los pasos 1, 3, 5 y 10 y una serie por cada estado

### Requirement: Escalas y colores consistentes
Ambas gráficas SHALL usar un eje vertical de 0 a 100 por ciento, tooltips con un decimal, una leyenda visible y un color fijo por estado compartido entre ambas gráficas.

#### Scenario: Leer valores y distinguir estados
- **WHEN** se consulta cualquiera de las gráficas
- **THEN** el eje vertical se expresa de 0 % a 100 %, los tooltips muestran un decimal y Aldea Kuvaq, Eliseo, Tiempo intermedio y Reinicio mantienen respectivamente los colores marrón, azul de Elysium, naranja y rojo óxido

### Requirement: Gráficas accesibles
Cada gráfica SHALL exponer su propósito mediante un texto alternativo accesible en español y adaptarse al ancho disponible sin desbordar la pantalla.

#### Scenario: Navegar las gráficas con tecnologías de asistencia
- **WHEN** se consulta el contenido de cada canvas
- **THEN** cada uno tiene un `aria-label` en español que identifica la información representada

### Requirement: Fallback si las gráficas no están disponibles
Si Chart.js no está disponible, la aplicación SHALL mostrar un mensaje informativo en español y conservar funcionales la matriz de transición y los resultados existentes.

#### Scenario: Chart.js no se carga
- **WHEN** la aplicación no dispone de Chart.js
- **THEN** muestra un mensaje en español en el área de gráficas y siguen disponibles la matriz y las tarjetas de resultados

### Requirement: Pruebas de datos para gráficas
Las transformaciones puras de datos que alimentan las gráficas SHALL poder probarse con `node:test` mediante `npm test`, sin requerir un navegador.

#### Scenario: Ejecutar pruebas de datos de gráficas
- **WHEN** se ejecuta `npm test`
- **THEN** se ejecutan las pruebas de `src/charts-data.js` junto con las pruebas existentes sin requerir Chart.js ni un navegador
