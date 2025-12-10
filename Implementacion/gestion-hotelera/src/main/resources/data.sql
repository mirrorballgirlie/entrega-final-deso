-- -- ===========================
-- --   HABITACIONES
-- -- ===========================

-- INSERT INTO habitacion (id, numero, tipo, capacidad, precio, descripcion, estado)
-- VALUES 
-- (1, 101, 0, 1, 20000, 'Habitación individual estándar', 'DISPONIBLE'),
-- (2, 102, 1, 2, 26000, 'Habitación doble estándar', 'DISPONIBLE'),
-- (3, 103, 2, 2, 32000, 'Habitación doble superior', 'DISPONIBLE'),
-- (4, 104, 3, 4, 38000, 'Habitación family plan', 'DISPONIBLE'),
-- (5, 105, 4, 2, 50000, 'Suite doble premium', 'DISPONIBLE');

-- -- ===========================
-- --   RESERVAS
-- --   (estado ordinal: 0 = ACTIVA)
-- -- ===========================

-- INSERT INTO reserva (id, numero, estado, fecha_desde, fecha_hasta, nombre, apellido, telefono, habitacion_id)
-- VALUES
-- (1, 5001, 0, '2025-12-01', '2025-12-05', 'María', 'Dayub', '3411234567', 1),
-- (2, 5002, 0, '2025-12-03', '2025-12-06', 'Carlos', 'López', '1147859632', 2),
-- (3, 5003, 0, '2025-12-02', '2025-12-04', 'Lucía', 'Fernández', '1122334455', 3),
-- (4, 5004, 0, '2025-12-10', '2025-12-15', 'Pedro', 'Martínez', '1156789123', 4),
-- (5, 5005, 0, '2025-12-20', '2025-12-25', 'Ana', 'Gómez', '1132445566', 5);
