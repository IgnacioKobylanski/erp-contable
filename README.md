# ERP Contable

Sistema de gestión contable con partida doble (débito/crédito), construido como proyecto de referencia full-stack: **Django REST Framework** en el backend y **React + TypeScript** en el frontend.


## Stack técnico

**Backend**
- Django 5 + Django REST Framework
- MySQL
- JWT (`djangorestframework-simplejwt`)
- drf-spectacular (documentación OpenAPI / Swagger)

**Frontend**
- React 19 + TypeScript
- Vite
- React Router v7
- Axios
- CSS Modules + variables CSS nativas (sin frameworks de UI)

## Funcionalidad

- **Plan de Cuentas**: CRUD completo, con jerarquía de cuentas (padre/hijo) y clasificación por tipo (Activo, Pasivo, Patrimonio, Ingreso, Egreso).
- **Transacciones (asientos contables)**: carga de asientos con múltiples movimientos, validación de partida doble (débito = crédito) tanto en el cliente como en el servidor.
- **Reportes contables**:
  - Libro Diario, con filtro por rango de fechas.
  - Libro Mayor, con saldo acumulado por movimiento y saldo inicial de período (igual que un extracto bancario real).
  - Balance General, respetando la ecuación contable fundamental (`Activo = Pasivo + Patrimonio`), con el resultado del ejercicio inyectado en vivo desde el Estado de Resultados.
  - Estado de Resultados.
  - Panel general con el total de débitos/créditos del sistema y verificación de balanceo global.
- **Tablas configurables**: ordenamiento por columna, mostrar/ocultar columnas, y reordenamiento por arrastre — implementado 100% con APIs nativas del navegador (sin librerías de terceros).
- **Modo claro/oscuro**, con persistencia y detección de preferencia del sistema operativo.
- Notificaciones de éxito/error (toasts), estados de carga, diseño responsive (mobile-first en tablas).

## Arquitectura y decisiones de diseño

Este proyecto se construyó con un énfasis particular en la trazabilidad de decisiones, no solo en el código final. Algunos ejemplos:

- **Auditoría completa del backend heredado**: se detectaron y corrigieron 10+ bugs reales antes de tocar el frontend, incluyendo un cálculo de saldo contablemente incorrecto para cuentas de Gasto, rutas de reportes nunca conectadas al router, y una inconsistencia de mayúsculas/minúsculas entre el modelo y los serializers.
- **Separación de tipos de lectura y escritura** en el frontend (`Account` vs `AccountPayload`, `Transaction` vs `TransactionPayload`): evita que un mismo tipo tenga que representar dos formas estructuralmente distintas de una misma entidad.
- **Sistema de diseño centralizado**: toda la paleta de colores vive en variables CSS (`:root` / `[data-theme="dark"]`), lo que permitió agregar modo oscuro completo sin tocar un solo componente ya existente.
- **Cero dependencias innecesarias**: antes de sumar cualquier librería (TanStack Table, dnd-kit, xlsx), se investigó su estado de mantenimiento y seguridad. En más de un caso se optó deliberadamente por una implementación nativa (drag-and-drop con la HTML5 Drag and Drop API, ordenamiento de tablas con `Array.sort`) en vez de sumar una dependencia externa para un problema de complejidad moderada.
- **Balance General corregido conceptualmente**: el reporte fue ajustado para excluir cuentas de Ingreso/Egreso (transitorias) e inyectar el Resultado del Ejercicio dentro del Patrimonio Neto, respetando la ecuación contable fundamental en vez de listar todas las cuentas sin distinción.

## Estructura del proyecto

ERP-CONTABLE/
├── backend/
│ └── accounting/
│ ├── api/ # Serializers, views y urls de los reportes (Diario, Mayor, Balance, Resultados)
│ ├── reports/ # Lógica pura de generación de cada reporte
│ ├── models.py # Account, Transaction, Entry
│ ├── serializers.py # CRUD de Account/Transaction/Entry
│ ├── views.py
│ └── urls.py
└── frontend/
└── src/
├── components/ # Componentes reutilizables (Layout, Spinner, ToastContainer, ColumnConfigPanel)
├── contexts/ # ToastContext, ThemeContext
├── hooks/ # useColumnConfig (ordenamiento, visibilidad y orden de columnas persistido)
├── pages/ # Una carpeta por sección: accounts, transactions, reports, dashboard
├── services/ # Capa de acceso a la API (axios), tipada de punta a punta
├── styles/ # CSS global compartido (botones, panel de columnas, tipos de cuenta, tablas responsive)
└── types/ # Contratos de datos, separados en tipos de lectura y de escritura

## Cómo correrlo localmente

### Backend

```bash
cd backend
python -m venv env
env\Scripts\activate       # Windows
# source env/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

Crear un archivo `.env` en `backend/` con las credenciales de MySQL y la `SECRET_KEY`:

```bash
python manage.py migrate
python manage.py runserver
```

La API queda disponible en `http://127.0.0.1:8000/`, con documentación interactiva en `http://127.0.0.1:8000/api/docs/swagger/`.

### Frontend

```bash
cd frontend
npm install
```

Crear un archivo `.env.local` en `frontend/`:

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173/`.

## Roadmap / próximos pasos

- Exportación de reportes (CSV, sin dependencias externas)
- Asientos recurrentes / plantillas de asiento
- Modelo de Clientes/Proveedores (CUIT, condición fiscal)
- Integración con ARCA (facturación electrónica, WSAA/WSFE) — requiere certificado digital y CUIT habilitado, fuera del alcance de este proyecto de referencia por ahora

## Nota sobre el proceso de desarrollo

Este proyecto fue construido de forma iterativa, con foco explícito en entender el "por qué" de cada decisión (arquitectura de tipos, separación de responsabilidades, cuándo centralizar código y cuándo no) antes que en la velocidad de entrega. La intención es que sirva como base de patrones reutilizable en proyectos futuros con otros stacks.