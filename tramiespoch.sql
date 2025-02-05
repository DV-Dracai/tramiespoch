-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-02-2025 a las 07:55:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tramiespoch`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrera`
--

CREATE TABLE `carrera` (
  `codigo` int(11) NOT NULL,
  `nombre_carrera` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrera`
--

INSERT INTO `carrera` (`codigo`, `nombre_carrera`) VALUES
(1, 'Ingeniería en Software');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carreraperiodo`
--

CREATE TABLE `carreraperiodo` (
  `carrera_id` int(11) NOT NULL,
  `periodo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carreraperiodo`
--

INSERT INTO `carreraperiodo` (`carrera_id`, `periodo_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `estudiante_id` varchar(10) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destinatario`
--

CREATE TABLE `destinatario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `cargo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `destinatario`
--

INSERT INTO `destinatario` (`id`, `nombre`, `cargo`) VALUES
(1, 'Washington Luna', 'Decano de la Facultad de Informática y Electrónica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

CREATE TABLE `estudiante` (
  `codigo` varchar(10) NOT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `cedula` varchar(15) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `carrera_id` int(11) DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT 0,
  `codigo_verificacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`codigo`, `nombre_completo`, `cedula`, `correo`, `password`, `carrera_id`, `verificado`, `codigo_verificacion`) VALUES
('4569', 'Doris Shunta', '1803826633', 'angelreliz04@gmail.com', '$2y$10$PSGi7KxDdfXnmmm6keuUJuJ.vFsgrcn8S89ElCdAHBGoPR9kcgW42', 1, 1, NULL),
('7281', 'Marco Vega', '1800356365', 'jhonaliz2405@gmail.com', '$2y$10$aoRuyoXzEnRDKLxE/Sef9Oq2IgvHG.4ikm6CBF3/hI7Evt4jMD8Qa', 1, 1, NULL),
('7359', 'Emilio Pesantez', '1234567890', 'emlio@gmail.com', '$2y$10$EO84DIE3pHhph4i0SjyKm.8z1Zyph6bCBMCbKhlLQTJnr163bYTvG', 1, 0, '01aca84eb72231177ccce9fd1d388709'),
('8426', 'Jonathan Lizano', '1850145978', 'axellizan19@gmail.com', '$2y$10$ldD4.0sy76gH1L3RIm4WJuPpQ8YBuy8v3lxaTnUxbB5Dim0zo0kfG', 1, 1, NULL),
('8956', 'Rene Lizano', '1803826666', 'bizkaialan@gmail.com', '$2y$10$6r9K6eMTI4Eih2Rt8sGcnO1F4CAZp1dpcWePCOjnz2O6KTUmnA4de', 1, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `sender` enum('estudiante','bot') NOT NULL,
  `texto` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `periodo`
--

CREATE TABLE `periodo` (
  `codigo` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `periodo`
--

INSERT INTO `periodo` (`codigo`, `fecha_inicio`, `fecha_fin`, `descripcion`) VALUES
(1, '2024-10-07', '2025-02-14', 'Octubre 2024 - Febrero 2025');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipotramite`
--

CREATE TABLE `tipotramite` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipotramite`
--

INSERT INTO `tipotramite` (`id`, `nombre`) VALUES
(2, 'Retiro de Materia'),
(1, 'Tercera Matrícula');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tramite`
--

CREATE TABLE `tramite` (
  `codigo` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha_envio` date NOT NULL,
  `estudiante_id` varchar(10) NOT NULL,
  `tipo_tramite_id` int(11) NOT NULL,
  `destinatario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tramite`
--

INSERT INTO `tramite` (`codigo`, `descripcion`, `fecha_envio`, `estudiante_id`, `tipo_tramite_id`, `destinatario_id`) VALUES
(1, 'Solicitud de tercera matrícula para las materias: BD. Periodo académico: 4.', '0000-00-00', '8956', 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `carreraperiodo`
--
ALTER TABLE `carreraperiodo`
  ADD PRIMARY KEY (`carrera_id`,`periodo_id`),
  ADD KEY `periodo_id` (`periodo_id`);

--
-- Indices de la tabla `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_chat_estudiante` (`estudiante_id`);

--
-- Indices de la tabla `destinatario`
--
ALTER TABLE `destinatario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_carrera_estudiante` (`carrera_id`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mensaje_chat` (`chat_id`);

--
-- Indices de la tabla `periodo`
--
ALTER TABLE `periodo`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `tipotramite`
--
ALTER TABLE `tipotramite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `tramite`
--
ALTER TABLE `tramite`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `fk_tramite_estudiante` (`estudiante_id`),
  ADD KEY `fk_tipo_tramite` (`tipo_tramite_id`),
  ADD KEY `fk_tramite_destinatario` (`destinatario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrera`
--
ALTER TABLE `carrera`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `destinatario`
--
ALTER TABLE `destinatario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `periodo`
--
ALTER TABLE `periodo`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tipotramite`
--
ALTER TABLE `tipotramite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tramite`
--
ALTER TABLE `tramite`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carreraperiodo`
--
ALTER TABLE `carreraperiodo`
  ADD CONSTRAINT `carreraperiodo_ibfk_1` FOREIGN KEY (`carrera_id`) REFERENCES `carrera` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `carreraperiodo_ibfk_2` FOREIGN KEY (`periodo_id`) REFERENCES `periodo` (`codigo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `fk_chat_estudiante` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`codigo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `fk_carrera_estudiante` FOREIGN KEY (`carrera_id`) REFERENCES `carrera` (`codigo`) ON DELETE SET NULL;

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `fk_mensaje_chat` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tramite`
--
ALTER TABLE `tramite`
  ADD CONSTRAINT `fk_tipo_tramite` FOREIGN KEY (`tipo_tramite_id`) REFERENCES `tipotramite` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tramite_destinatario` FOREIGN KEY (`destinatario_id`) REFERENCES `destinatario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tramite_estudiante` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`codigo`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
