# Spec Delta

## ADDED Requirements

### Requirement: Evolución de distribuciones por salto
El modelo SHALL proporcionar `evolucionPorPasos(estadoInicial, pasos)` y devolver una distribución por cada paso desde 0 hasta `pasos`, inclusive, con probabilidades en el orden de los estados.

#### Scenario: Incluir el estado inicial y todos los pasos
- **WHEN** se solicita la evolución desde un estado válido para varios pasos
- **THEN** el resultado contiene `pasos + 1` distribuciones, la primera concentra toda la probabilidad en el estado inicial y cada distribución posterior corresponde al siguiente salto

#### Scenario: Evolución para cero pasos
- **WHEN** se solicita una evolución con `pasos = 0`
- **THEN** el resultado contiene únicamente la distribución inicial

#### Scenario: Distribuciones normalizadas
- **WHEN** se calcula una evolución para un estado y cantidad de pasos válidos
- **THEN** cada distribución suma 1 dentro de la precisión numérica

#### Scenario: Cantidad de pasos negativa o no entera
- **WHEN** se solicita una evolución con `pasos` negativo o no entero
- **THEN** la función lanza un error claro en español

#### Scenario: Estado inicial inexistente
- **WHEN** se solicita una evolución desde un estado que no pertenece al modelo
- **THEN** la función lanza un error claro en español
