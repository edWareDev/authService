````javascript
# Guía Completa de Git para Equipos de Desarrollo

## 📋 Tabla de Contenidos
1. [Introducción a Git](#1-introducción-a-git)
2. [Instalación y Configuración](#2-instalación-y-configuración)
3. [Conceptos Fundamentales](#3-conceptos-fundamentales)
4. [Comandos Básicos](#4-comandos-básicos)
5. [Trabajo con Repositorios Remotos](#5-trabajo-con-repositorios-remotos)
6. [Branching y Merging](#6-branching-y-merging)
7. [Flujos de Trabajo en Equipos](#7-flujos-de-trabajo-en-equipos)
8. [Resolución de Conflictos](#8-resolución-de-conflictos)
9. [Comandos Avanzados](#9-comandos-avanzados)
10. [Problemas Comunes y Soluciones](#10-problemas-comunes-y-soluciones)
11. [Mejores Prácticas](#11-mejores-prácticas)

## 1. Introducción a Git

### ¿Qué es Git?
Git es un sistema de control de versiones distribuido de código abierto diseñado para manejar desde proyectos pequeños hasta muy grandes con velocidad y eficiencia.

### Ventajas para Equipos de Desarrollo
- **Control de versiones distribuido**: Cada desarrollador tiene copia completa del historial
- **Trabajo offline**: Se puede trabajar sin conexión a internet
- **Ramas livianas**: Creación y cambio entre ramas es rápido y eficiente
- **Integridad de datos**: Todo está checksumeado con SHA-1
- **Flujos de trabajo flexibles**: Soporta múltiples estrategias de branching

## 2. Instalación y Configuración

### Instalación en Diferentes Sistemas

#### Windows
```bash
# Usar winget (recomendado para Windows 10/11)
winget install Git.Git
# --version: Especificar versión específica
# --quiet: Instalación silenciosa

# O descargar desde git-scm.com
````

#### macOS

```bash
# Usar Homebrew (recomendado)
brew install git
# --build-from-source: Compilar desde código fuente
# --HEAD: Instalar última versión de desarrollo

# O instalar Xcode Command Line Tools
xcode-select --install
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git
# -y: Confirmar automáticamente la instalación
# --no-install-recommends: Instalar solo dependencias esenciales
```

### Configuración Inicial Obligatoria

```bash
# Configurar identidad (OBLIGATORIO antes de hacer commits)
git config --global user.name "Tu Nombre Completo"
# --global: Aplica la configuración a todos los repositorios del usuario

git config --global user.email "tu.email@empresa.com"
# El email debe coincidir con el de tu cuenta GitLab/GitHub

# Configurar editor preferido
git config --global core.editor "code --wait"
# --wait: Espera a que el editor se cierre antes de continuar

# Habilitar colores en la terminal
git config --global color.ui auto
# auto: Colores automáticos | always: Siempre colores | never: Sin colores

# Configurar comportamiento de line endings
# Windows:
git config --global core.autocrlf true
# Convierte LF a CRLF al hacer checkout, CRLF a LF al commitear

# Linux/Mac:
git config --global core.autocrlf input
# Convierte CRLF a LF al commitear, pero no modifica al hacer checkout

# Configurar aliases útiles
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
```

### Configuración por Proyecto

```bash
# Para configuraciones específicas de proyecto
cd proyecto-empresa
git config user.email "proyecto-especifico@empresa.com"
# Sin --global: aplica solo al repositorio actual

# Configurar estrategia de pull por defecto
git config pull.rebase false
# false: merge (default) | true: rebase | only: solo si es fast-forward
```

## 3. Conceptos Fundamentales

### Los Tres Estados de Git

1. **Modified (Modificado)**: El archivo ha sido cambiado pero no está marcado para el próximo commit.
2. **Staged (Preparado)**: El archivo modificado está marcado para ir en el próximo commit.
3. **Committed (Confirmado)**: El archivo está almacenado de forma segura en la base de datos local.

### Las Tres Áreas de Trabajo

```
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│                 │    │                 │    │                  │
│  Working        │    │  Staging        │    │  Git Repository  │
│  Directory      │    │  Area           │    │                  │
│                 │    │                 │    │                  │
│  (Modified)     │    │  (Staged)       │    │  (Committed)     │
│                 │    │                 │    │                  │
└─────────────────┘    └─────────────────┘    └──────────────────┘
         │                      │                       │
         │ git add              │ git commit            │
         ├─────────────────────►├──────────────────────►│
         │                      │                       │
         │ git restore          │ git reset             │
         ◄──────────────────────◄───────────────────────◄
```

#### Working Directory

- Donde se trabaja con los archivos del proyecto
- Contiene la versión actual de los archivos
- Los cambios aquí no están versionados todavía

#### Staging Area (Índice)

- Área intermedia entre working directory y repository
- Contiene snapshot de lo que irá en el próximo commit
- Permite seleccionar cambios específicos para commit

#### Git Repository

- Base de datos que almacena todos los commits
- Contiene el historial completo del proyecto
- Cada commit es una instantánea inmutable del proyecto

## 4. Comandos Básicos

### Inicialización y Clonación

```bash
# Iniciar nuevo repositorio desde cero
mkdir proyecto-empresa
cd proyecto-empresa
git init
# Crea directorio .git/ con estructura inicial
# --bare: Crear repositorio sin working directory (para servidores)

# Clonar repositorio existente (HTTPS)
git clone https://gitlab.empresa.com/grupo/proyecto.git
# <URL>: URL del repositorio remoto a clonar

# Clonar con autenticación SSH (recomendado)
git clone git@gitlab.empresa.com:grupo/proyecto.git
# Más seguro y no requiere ingresar credenciales cada vez

# Clonar rama específica
git clone -b desarrollo https://gitlab.empresa.com/grupo/proyecto.git
# -b <nombre-rama>: Especificar rama a clonar
# --single-branch: Clonar solo esa rama (ahorra espacio)

# Clonar con profundidad limitada (para repositorios grandes)
git clone --depth 1 https://gitlab.empresa.com/grupo/proyecto.git
# --depth <n>: Limitar historial a n commits recientes
```

### Comandos de Estado y Visualización

```bash
# Ver estado detallado del repositorio
git status
# Muestra: archivos modificados, staged, untracked, y estado de rama

git status -s
# -s, --short: Formato resumido (recomendado para uso diario)
# M: Modified (modificado, no staged)
# A: Added (agregado al staging)
# D: Deleted (eliminado)
# R: Renamed (renombrado)
# C: Copied (copiado)
# U: Unmerged (sin merge)
# ??: Untracked (no trackeado)

# Ver diferencias entre áreas
git diff
# Muestra diferencias entre working directory y staging area

git diff --staged
# --staged, --cached: Muestra diferencias entre staging area y último commit

git diff --name-only
# --name-only: Solo muestra nombres de archivos con diferencias
# Útil para scripts y automatización

git diff HEAD
# Muestra todos los cambios (staged + unstaged) desde último commit
```

### Trabajo con Archivos

```bash
# Agregar archivos al staging area
git add archivo.txt
# Agrega archivo específico al staging

git add .
# .: Agrega todos los archivos del directorio actual y subdirectorios
# -A, --all: Agrega todos los archivos del proyecto (incluye eliminados)

git add *.js
# Patrones glob para seleccionar múltiples archivos

git add -u
# -u, --update: Agrega solo archivos ya trackeados que fueron modificados/eliminados
# No incluye archivos nuevos (untracked)

git add -p
# -p, --patch: Modo interactivo - permite seleccionar porciones de cambios
# y: stage este hunk | n: no stage este hunk
# q: quit | a: stage este hunk y todos los siguientes
# d: no stage este hunk ni los siguientes | /: buscar hunk

# Remover archivos del control de versiones
git rm archivo.txt
# Elimina del filesystem y del staging area
# -f, --force: Forzar eliminación incluso si hay cambios no commitados

git rm --cached archivo.txt
# --cached: Remueve del staging area pero mantiene en filesystem
# Útil para archivos agregados por error que quieren mantenerse locales

# Renombrar/mover archivos (mejor práctica)
git mv viejo-nombre.txt nuevo-nombre.txt
# Equivalente a: mv + git rm + git add
# Mantiene el historial del archivo
# -f, --force: Forzar renombrado incluso si existe el archivo destino
```

### Creación de Commits Efectivos

```bash
# Commit básico con mensaje corto
git commit -m "feat: agregar funcionalidad de usuario"
# -m <mensaje>: Especificar mensaje del commit
# Convención: tipo(alcance): descripción breve

# Commit con descripción detallada
git commit -m "feat: implementar sistema de autenticación" -m "
- Agregar login con email y contraseña
- Implementar validación de tokens JWT
- Agregar middleware de autenticación
- Incluir tests unitarios
"
# Múltiples -m para mensaje multilínea
# Primera línea: título breve (<=50 caracteres)
# Línea en blanco
# Líneas siguientes: descripción detallada

# Agregar y commit en un paso
git commit -am "fix: corregir error en cálculo de impuestos"
# -a, --all: Incluir todos los archivos trackeados modificados/eliminados
# No incluye archivos nuevos (untracked)
# Útil para commits rápidos de archivos ya conocidos

# Modificar último commit
git commit --amend -m "feat: implementar autenticación mejorada"
# --amend: Reemplaza el último commit
# Cambia el mensaje y/o agrega archivos olvidados
# ¡CUIDADO!: Cambia el hash del commit, no usar en commits ya pusheados

git commit --amend --no-edit
# --no-edit: Modificar commit pero mantener el mismo mensaje
# Útil para agregar archivos olvidados sin cambiar mensaje

# Commit con fecha específica
git commit --date="2024-01-15 10:30:00" -m "feat: actualización"
# --date: Especificar fecha personalizada para el commit
# Formato: "YYYY-MM-DD HH:MM:SS"

# Commit vacío (útil para triggers)
git commit --allow-empty -m "chore: trigger deployment"
# --allow-empty: Permite commit sin cambios
```

## 5. Trabajo con Repositorios Remotos

### Configuración de Repositorios Remotos

```bash
# Ver repositorios remotos configurados
git remote -v
# -v, --verbose: Modo verbose, muestra URLs de fetch/push
# Output: origin  https://gitlab.empresa.com/repo.git (fetch)
#         origin  https://gitlab.empresa.com/repo.git (push)

# Agregar nuevo repositorio remoto
git remote add origin https://gitlab.empresa.com/grupo/proyecto.git
# add <name> <url>: Agregar remoto con nombre específico
# Convención: 'origin' para repositorio principal

# Cambiar URL de remoto existente
git remote set-url origin https://nuevo-gitlab.empresa.com/repo.git
# set-url <name> <newurl>: Cambiar URL de remoto
# Útil cuando el servidor Git cambia de ubicación

# Ver información detallada de remoto
git remote show origin
# show <name>: Muestra información completa del remoto
# Incluye: URLs, ramas trackeadas, estado de sincronización

# Renombrar remoto
git remote rename origin main-repo
# rename <old> <new>: Cambiar nombre de remoto

# Eliminar remoto
git remote remove origin
# remove <name>: Eliminar referencia a remoto
```

### Sincronización con Repositorio Central

```bash
# Descargar cambios sin modificar working directory
git fetch
# Descarga todos los cambios del remoto por defecto pero no fusiona
# Seguro: no afecta working directory ni staging area

git fetch origin
# Fetch específico de un remoto

git fetch --all
# --all: Fetch de todos los remotos configurados

git fetch --prune
# --prune: Elimina referencias a ramas remotas que ya no existen
# Mantiene el repositorio local limpio

git fetch --dry-run
# --dry-run: Mostrar qué se haría sin ejecutarlo realmente

# Descargar y fusionar cambios
git pull
# Equivalente a: git fetch + git merge
# Usa la estrategia configurada en pull.rebase

git pull origin main
# Pull específico de rama de remoto específico

git pull --rebase origin main
# --rebase: Usar rebase en lugar de merge para mantener historia lineal
# Mejor práctica para features locales

git pull --ff-only origin main
# --ff-only: Pull solo si puede hacer fast-forward
# Fallará si requiere merge commit

# Subir cambios al repositorio remoto (SOLO A RAMAS DE FEATURE)
git push origin feature/nueva-funcionalidad
# Subir rama local al remoto
# ¡IMPORTANTE!: Nunca push directo a main/develop

git push -u origin feature/nueva-funcionalidad
# -u, --set-upstream: Establecer upstream tracking
# Configura la relación entre rama local y remota
# Después se puede usar solo 'git push' sin especificar rama

# Push seguro con verificación
git push --force-with-lease
# --force-with-lease: Force push que verifica que no hay cambios nuevos en remoto
# Más seguro que --force: evita sobrescribir trabajo de otros
# Útil después de rebase local

git push --force-if-includes
# --force-if-includes: Verifica que los cambios locales incluyen los cambios remotos
# Aún más seguro que --force-with-lease

# Eliminar rama remota
git push origin --delete feature/vieja
# --delete: Elimina rama del repositorio remoto
# Forma alternativa: git push origin :feature/vieja

# Push tags
git push --tags
# --tags: Push todos los tags al remoto

git push --follow-tags
# --follow-tags: Push commits y tags asociados a esos commits
```

### Flujo de Trabajo Estándar Empresarial

```bash
# 1. Siempre empezar actualizado desde main
git checkout main
git pull origin main
# Asegura tener la versión más reciente antes de crear nueva feature

# 2. Crear rama para nueva feature
git checkout -b feature/nombre-feature
# -b: Crear y cambiar a nueva rama
# Convención: feature/descripcion-breve
# Ejemplo: feature/user-authentication, feature/payment-integration

# 3. Desarrollo con commits atómicos
git add .
git commit -m "feat: implementar módulo inicial"
git push origin feature/nombre-feature
# Commits pequeños y frecuentes
# Push temprano para backup y posibilidad de colaboración

# 4. Mantener rama actualizada con main
git fetch origin
git rebase origin/main
# Rebase para mantener historia lineal
# Resolver conflictos durante rebase si es necesario

# 5. Subir cambios actualizados
git push --force-with-lease origin feature/nombre-feature
# Force push seguro después de rebase
# --force-with-lease previene sobrescribir trabajo de otros

# 6. Crear Merge Request en GitLab
# - Asignar reviewers apropiados
# - Completar template de MR con descripción clara
# - Esperar aprobación y CI/CD checks
# - Merge se realiza mediante GitLab UI después de aprobación

# 7. Después del merge
git checkout main
git pull origin main
git branch -d feature/nombre-feature
# Actualizar localmente y eliminar rama local ya mergeada
```

## 6. Branching y Merging

### Manejo de Ramas en Equipo

```bash
# Ver ramas locales
git branch
# Lista ramas locales, * indica rama actual

git branch -r
# -r, --remotes: Solo ramas remotas

git branch -a
# -a, --all: Todas las ramas (locales y remotas)

# Ver información detallada de ramas
git branch -v
# -v, --verbose: Muestra último commit de cada rama

git branch -vv
# -vv: Modo más verbose - muestra tracking information
# Ejemplo: feature/login [origin/feature/login] abc123 feat: login

# Filtrar ramas mergeadas
git branch --merged
# --merged: Muestra ramas ya mergeadas a la actual

git branch --no-merged
# --no-merged: Muestra ramas no mergeadas a la actual

# Crear nuevas ramas
git branch nueva-rama
# Crea rama pero no cambia a ella

git branch nueva-rama commit-hash
# Crear rama desde commit específico

# Cambiar entre ramas
git checkout nombre-rama
# Cambia a rama existente

git switch nombre-rama
# switch: Comando más moderno y intuitivo (Git 2.23+)
# Menos confuso que checkout para cambiar ramas

# Crear y cambiar a nueva rama
git checkout -b feature/nueva-funcionalidad
git switch -c feature/nueva-funcionalidad
# -c, --create: Crear y cambiar a nueva rama

# Cambiar a rama anterior
git switch -
# -: Cambia a la rama anterior (como cd -)

# Eliminar ramas
git branch -d rama-finalizada
# -d, --delete: Eliminación segura (solo si mergeada)

git branch -D rama-con-cambios
# -D: Force delete - elimina aunque tenga cambios no mergeados

# Renombrar rama actual
git branch -m nuevo-nombre
# -m, --move: Renombrar rama actual

git branch -m viejo-nombre nuevo-nombre
# Renombrar rama específica
```

### Estrategias de Merge

```bash
# Merge básico (fast-forward si posible)
git checkout main
git merge feature-rama
# Intenta hacer fast-forward, si no three-way merge

# Merge siempre con commit de merge
git merge --no-ff feature-rama
# --no-ff: No fast-forward - siempre crea commit de merge
# Mejor para historial: muestra explícitamente que feature fue mergeada

# Merge solo si es fast-forward
git merge --ff-only feature-rama
# --ff-only: Fallará si no puede hacer fast-forward
# Útil para asegurar historia lineal

# Merge combinando commits (squash)
git merge --squash feature-rama
git commit -m "feat: implementar feature completa"
# --squash: Combina todos los commits de la rama en un solo commit
# Mantiene historia main limpia pero pierde historial detallado de feature
# Útil para features con muchos commits de WIP

# Merge con mensaje personalizado
git merge feature-rama -m "Merge feature X con mejoras de performance"
# -m: Mensaje personalizado para el merge commit

# Abortar merge en progreso
git merge --abort
# --abort: Abortar merge y volver al estado anterior
```

### Rebase vs Merge

**Cuándo usar Rebase:**

- Ramas locales no compartidas con otros
- Antes de crear pull/merge requests
- Cuando se quiere historia lineal y limpia
- Para integrar cambios frecuentes de main/develop

**Cuándo usar Merge:**

- Ramas compartidas con otros desarrolladores
- Cuando se quiere preservar historia completa
- Para integrar features completas
- En ramas principales (main, develop)

```bash
# Rebase sobre main
git checkout feature-rama
git rebase main
# Reaplica commits de feature sobre main actual
# Resultado: historia lineal como si se hubiera trabajado sobre main actualizado

# Rebase interactivo para limpiar historia
git rebase -i HEAD~5
# -i, --interactive: Modo interactivo - abre editor para modificar commits
# HEAD~5: Últimos 5 commits

# Comandos de rebase interactivo:
# pick: Usar commit sin cambios
# reword: Usar commit pero editar mensaje
# edit: Usar commit pero pausar para modificar
# squash: Combinar con commit anterior (mantiene ambos mensajes)
# fixup: Combinar con commit anterior (descarta mensaje)
# drop: Eliminar commit completamente

# Rebase con estrategia específica
git rebase --strategy-option theirs main
# --strategy-option: Opciones de estrategia de merge durante rebase
# theirs: Preferir cambios de la rama sobre la que se rebasea
# ours: Preferir cambios de la rama actual

# Continuar/abortar rebase
git rebase --continue
# --continue: Continuar rebase después de resolver conflictos

git rebase --skip
# --skip: Saltar commit problemático

git rebase --abort
# --abort: Abortar rebase y volver al estado anterior

# Rebase con autosquash
git rebase -i --autosquash HEAD~5
# --autosquash: Reorganiza automáticamente commits marcados con fixup!/squash!
```

## 7. Flujos de Trabajo en Equipos

### Git Flow Simplificado para Empresas

```bash
# Ramas principales permanentes
main       # Producción: solo código estable y versionado
develop    # Integración: pre-producción, testing integration

# Ramas de apoyo temporales
feature/*   # Desarrollo de nuevas funcionalidades
hotfix/*    # Correcciones urgentes de producción

# Ejemplo de flujo completo de feature
git checkout develop
git checkout -b feature/nueva-autenticacion

# Desarrollo con commits atómicos
git add .
git commit -m "feat: agregar modelo de usuario"
git push origin feature/nueva-autenticacion

git add .
git commit -m "feat: implementar endpoints de auth"
git push origin feature/nueva-autenticacion

git add .
git commit -m "test: agregar tests de autenticación"
git push origin feature/nueva-autenticacion

# Finalizar feature - preparar para Merge Request
git fetch origin
git rebase origin/develop
# Resolver conflictos si es necesario

git push --force-with-lease origin feature/nueva-autenticacion

# Crear Merge Request en GitLab
# - Target: develop (nunca main directamente)
# - Asignar reviewers
# - Completar template de MR
# - Esperar aprobación y CI/CD pipeline

# Después de aprobación y merge en GitLab UI:
git checkout develop
git pull origin develop
git branch -d feature/nueva-autenticacion
# Actualizar localmente y limpiar rama local

# Para hotfixes de producción:
git checkout main
git checkout -b hotfix/urgente
# Hacer fix, commit, push
# MR de hotfix/ → main Y hotfix/ → develop
```

### Convenciones de Nombrado para Equipos

````bash
# Features (nuevas funcionalidades)
feature/user-authentication
feature/payment-integration-2024
feature/search-functionality

# Bug fixes (correcciones de errores)
fix/login-validation-error
fix/email-template-formatting
fix/database-connection-issue

# Hotfixes (urgencias de producción)
hotfix/security-patch-january
hotfix/critical-database-issue
hotfix/urgent-performance-fix

# Chores (tareas de mantenimiento)
chore/update-dependencies-january
chore/ci-cd-pipeline-improvements
chore/documentation-update

# Documentation
docs/api-reference-update
docs/architecture-decisions
docs/user-guide-improvements

# Refactor
# Guía Completa de Git para Equipos de Desarrollo (Continuación)

## 8. Resolución de Conflictos

### Identificación de Conflictos

```bash
# Ver estado durante operación conflictiva
git status
# Muestra: "Unmerged paths:" con lista de archivos conflictivos

# Ver archivos específicos con conflictos
git diff --name-only --diff-filter=U
# --diff-filter=U: Solo archivos unmerged (con conflictos)

# Ver diferencias durante conflicto
git diff
# Muestra diferencias incluyendo marcadores de conflicto

git diff --theirs
# --theirs: Muestra versión de "them" (la otra rama)

git diff --ours
# --ours: Muestra versión de "us" (nuestra rama actual)
````

### Resolución Paso a Paso

1. **Identificar archivos conflictivos**

```bash
git status
# Buscar sección "Unmerged paths:"
```

2. **Abrir y entender el conflicto**

```javascript
// Archivo con conflicto típico
<<<<<< HEAD
// Nuestra versión (rama actual)
console.log("Versión desarrollada en feature");
=======
// Su versión (rama siendo merged/rebased)
console.log("Versión desde main/develop");
>>>>>> branch-being-merged
```

3. **Resolver manualmente editando el archivo**

```javascript
// Versión resuelta - decidir qué cambios mantener
console.log("Versión fusionada acordada por el equipo");
```

4. **Marcar como resuelto**

```bash
git add archivo-resuelto.js
# Agregar cada archivo resuelto al staging
```

5. **Completar la operación**

```bash
# Para merge:
git commit -m "merge: resolve conflicts with feature/xyz"

# Para rebase:
git rebase --continue

# Para cherry-pick:
git cherry-pick --continue
```

### Herramientas de Resolución Visual

```bash
# Configurar VS Code como merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Usar herramienta visual para resolver
git mergetool
# --tool=<herramienta>: Especificar herramienta específica

# Abortar resolución si es necesario
git merge --abort
git rebase --abort
git cherry-pick --abort
# Vuelve al estado anterior a la operación conflictiva
```

## 9. Comandos Avanzados

### Git Stash (Trabajo Temporal)

```bash
# Guardar cambios no commitados temporalmente
git stash
# Guarda cambios en stash stack

git stash push -m "WIP: trabajo en progreso"
# -m: Mensaje descriptivo para el stash

git stash --include-untracked
# --include-untracked: Incluir archivos untracked

# Ver lista de stashes
git stash list
# stash@{0}: On feature: mensaje

# Aplicar stash
git stash apply
# Aplica el stash más reciente

git stash apply stash@{1}
# Aplica stash específico

git stash pop
# Aplica y elimina el stash más reciente

# Crear rama desde stash
git stash branch nueva-rama stash@{0}
# Crea nueva rama y aplica el stash

# Limpiar stashes
git stash drop stash@{1}
# Elimina stash específico

git stash clear
# Elimina todos los stashes
```

### Git Reflog (Historial de Operaciones)

```bash
# Ver historial de referencias
git reflog
# Muestra todas las operaciones que movieron HEAD

git reflog --date=iso
# --date=iso: Mostrar fechas en formato legible

# Recuperar commit perdido
git reflog
# Buscar operación donde se "perdió" el commit

git checkout abc123
git checkout -b rama-recuperada
# Recuperar commit y crear rama

# Limpiar reflog antiguo
git reflog expire --expire=90.days --all
# expire: Eliminar entradas más antiguas que 90 días
```

### Git Bisect (Búsqueda Binaria de Bugs)

```bash
# Iniciar búsqueda de bug
git bisect start

# Marcar commit actual como malo
git bisect bad

# Marcar commit conocido como bueno
git bisect good v1.0.0

# Probar commit actual y marcar
git bisect good  # Si no tiene el bug
git bisect bad   # Si tiene el bug

# Finalizar cuando encuentre el commit culpable
git bisect reset
```

## 10. Problemas Comunes y Soluciones

### Problemas con Commits

```bash
# Olvidé agregar archivos al último commit
git add archivo-olvidado.txt
git commit --amend --no-edit
# --amend: Modifica el último commit
# --no-edit: Mantiene el mismo mensaje

# Mensaje de commit incorrecto
git commit --amend -m "Nuevo mensaje correcto"

# Commit en rama equivocada
git checkout rama-correcta
git cherry-pick abc123f
git checkout rama-incorrecta
git reset --hard HEAD~1
```

### Problemas con Push

```bash
# Push rechazado - updates were rejected
git fetch origin
git rebase origin/main
git push --force-with-lease origin feature/rama

# Error de autenticación
git config --global credential.helper store
# Almacena credenciales

# Cambiar de HTTPS a SSH
git remote set-url origin git@gitlab.empresa.com:grupo/proyecto.git
```

### Recuperación de Errores

```bash
# Deshacer último commit (mantiene cambios)
git reset --soft HEAD~1
# --soft: Mantiene cambios en staging

# Deshacer último commit (pierde cambios)
git reset --hard HEAD~1
# --hard: Descarta todos los cambios

# Revertir commit específico
git revert abc123f
# Crea nuevo commit que deshace cambios

# Recuperar archivo eliminado
git checkout HEAD -- archivo-eliminado.txt
# Recupera versión del último commit
```

## 11. Mejores Prácticas

### Convenciones de Commits

**Estructura recomendada:**

```
tipo(alcance): descripción breve

Descripción detallada opcional

- Lista de cambios específicos
- Impacto en el sistema

Closes #123, Fixes #456
```

**Tipos estándar:**

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Cambios de formato
- `refactor`: Refactorización
- `test`: Pruebas
- `chore`: Mantenimiento
- `ci`: Integración continua

## ✅ Checklist de Implementación

### Configuración Inicial

- [ ] Git instalado correctamente
- [ ] user.name y user.email configurados
- [ ] Editor preferido configurado
- [ ] Aliases útiles configurados

### Repositorio

- [ ] .gitignore apropiado configurado
- [ ] README.md con instrucciones
- [ ] Estrategia de branching definida

### Flujo de Trabajo

- [ ] Nunca push directo a main/develop
- [ ] Siempre usar ramas de feature
- [ ] Commits atómicos y descriptivos
- [ ] Merge mediante MR/PR después de review

## 🎯 Conclusión

Esta guía proporciona las bases para trabajar efectivamente con Git en entornos empresariales. Las prácticas clave incluyen:

1. **Siempre usar ramas de feature** para desarrollo nuevo
2. **Commits atómicos** con mensajes descriptivos
3. **Mantener ramas actualizadas** con rebase regular
4. **Nunca push directo** a ramas principales
5. **Merge siempre mediante MR/PR** después de code review

Siguiendo estas prácticas, los equipos pueden colaborar eficientemente manteniendo un historial limpio y comprensible.

**📅 Última actualización: 2024**
