package com.carfuel.shared

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ProblemDetails> {
        val errors = ex.bindingResult.fieldErrors
            .groupBy(FieldError::getField)
            .mapKeys { entry -> camelToSnake(entry.key) }
            .mapValues { entry -> entry.value.map { it.code?.lowercase() ?: "invalid" } }

        val body = ProblemDetails(
            title = "Invalid request",
            status = HttpStatus.BAD_REQUEST.value(),
            code = "invalid_query_params",
            errors = errors
        )
        return ResponseEntity.badRequest().body(body)
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    fun handleTypeMismatch(ex: MethodArgumentTypeMismatchException): ResponseEntity<ProblemDetails> {
        val body = ProblemDetails(
            title = "Invalid request",
            status = HttpStatus.BAD_REQUEST.value(),
            code = "invalid_query_params",
            detail = "Invalid parameter ${ex.name}"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body)
    }

    @ExceptionHandler(InvalidQueryException::class)
    fun handleInvalidQuery(ex: InvalidQueryException): ResponseEntity<ProblemDetails> {
        val body = ProblemDetails(
            title = "Invalid request",
            status = HttpStatus.BAD_REQUEST.value(),
            code = "invalid_query_params",
            detail = ex.message
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body)
    }

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleNotFound(ex: ResourceNotFoundException): ResponseEntity<ProblemDetails> {
        val body = ProblemDetails(
            title = ex.title,
            status = HttpStatus.NOT_FOUND.value(),
            code = ex.code,
            detail = ex.message,
            instance = ex.instance
        )
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body)
    }

    @ExceptionHandler(ConflictException::class)
    fun handleConflict(ex: ConflictException): ResponseEntity<ProblemDetails> {
        val body = ProblemDetails(
            title = ex.title,
            status = HttpStatus.CONFLICT.value(),
            code = ex.code,
            detail = ex.message
        )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body)
    }
}

class InvalidQueryException(message: String) : RuntimeException(message)

class ResourceNotFoundException(
    val title: String,
    val code: String,
    val instance: String,
    message: String? = null
) : RuntimeException(message)

class ConflictException(
    val title: String,
    val code: String,
    message: String? = null
) : RuntimeException(message)

private fun camelToSnake(name: String): String =
    name.replace(Regex("([a-z])([A-Z]+)"), "$1_$2").lowercase()
